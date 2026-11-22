-- Lead collection and first-month referral tracking for English City.
begin;

create schema if not exists english_city_private;
revoke all on schema english_city_private from public;

create table public.launch_leads (
  code uuid primary key,
  whatsapp text not null unique check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  locale text not null check (locale in ('kk', 'ru', 'en')),
  referrer_code uuid references public.launch_leads(code) on delete set null check (referrer_code <> code),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  payment_reference text unique,
  discount_friends integer not null default 0 check (discount_friends between 0 and 4)
);

create index launch_leads_newest on public.launch_leads (created_at desc, code);
create index launch_leads_paid_referrals on public.launch_leads (referrer_code) where paid_at is not null;

alter table public.launch_leads enable row level security;
revoke all on public.launch_leads from public, anon, authenticated;
grant select (code, whatsapp, locale, referrer_code, created_at, paid_at, discount_friends)
  on public.launch_leads to authenticated;
create policy "launch leads: admins read" on public.launch_leads
  for select to authenticated using ((select public.is_admin()));

create view public.launch_lead_summary with (security_invoker = true) as
select lead.code, lead.whatsapp, lead.locale, lead.created_at, lead.paid_at, lead.discount_friends,
       (select count(*)::int from public.launch_leads friend
        where friend.referrer_code = lead.code and friend.paid_at is not null) as qualifying_friends
from public.launch_leads lead;

revoke all on public.launch_lead_summary from public, anon, authenticated;
grant select on public.launch_lead_summary to authenticated;

-- Public entry point is a narrow wrapper. Elevated functions live outside the Data API schema.
create function english_city_private.submit_launch_lead(
  whatsapp_number text, language text, friend_code uuid, new_code uuid
) returns text language plpgsql security definer set search_path = '' as $$
begin
  if whatsapp_number is null or whatsapp_number !~ '^\+[1-9][0-9]{7,14}$'
     or language is null or language not in ('kk', 'ru', 'en') or new_code is null then
    raise exception 'Invalid lead';
  end if;
  if friend_code is not null and (
    friend_code = new_code or not exists (select 1 from public.launch_leads where code = friend_code)
  ) then
    return 'badInvite';
  end if;

  insert into public.launch_leads (code, whatsapp, locale, referrer_code)
  values (new_code, whatsapp_number, language, friend_code)
  on conflict do nothing;

  -- A retry with the same code succeeds. An existing number never discloses its code.
  if exists (select 1 from public.launch_leads where whatsapp = whatsapp_number and code = new_code) then
    return 'created';
  end if;
  return 'duplicate';
end;
$$;

create function public.submit_launch_lead(
  whatsapp_number text, language text, friend_code uuid, new_code uuid
) returns text language sql security invoker set search_path = '' as $$
  select english_city_private.submit_launch_lead(whatsapp_number, language, friend_code, new_code);
$$;

create function english_city_private.record_launch_payment(
  lead_code uuid, transaction_reference text, qualifying_discount integer
) returns void language plpgsql security definer set search_path = '' as $$
declare
  eligible_friends integer;
  normalized_reference text := upper(btrim(transaction_reference));
begin
  if not public.is_admin() then
    raise exception 'Only admins can verify a payment';
  end if;
  if normalized_reference is null or char_length(normalized_reference) not between 1 and 100
     or qualifying_discount is null or qualifying_discount not between 0 and 4 then
    raise exception 'Invalid payment';
  end if;

  perform 1 from public.launch_leads where code = lead_code and paid_at is null for update;
  if not found then raise exception 'Lead not found or already paid'; end if;
  select least(count(*), 4)::int into eligible_friends
    from public.launch_leads where referrer_code = lead_code and paid_at is not null;
  if qualifying_discount > eligible_friends then
    raise exception 'Discount exceeds verified referrals';
  end if;
  update public.launch_leads
  set paid_at = now(), payment_reference = normalized_reference, discount_friends = qualifying_discount
  where code = lead_code;
end;
$$;

create function public.record_launch_payment(
  lead_code uuid, transaction_reference text, qualifying_discount integer
) returns void language sql security invoker set search_path = '' as $$
  select english_city_private.record_launch_payment(lead_code, transaction_reference, qualifying_discount);
$$;

revoke all on function english_city_private.submit_launch_lead(text, text, uuid, uuid) from public, anon, authenticated;
revoke all on function public.submit_launch_lead(text, text, uuid, uuid) from public, anon, authenticated;
revoke all on function english_city_private.record_launch_payment(uuid, text, integer) from public, anon, authenticated;
revoke all on function public.record_launch_payment(uuid, text, integer) from public, anon, authenticated;
grant usage on schema english_city_private to anon, authenticated;
grant execute on function english_city_private.submit_launch_lead(text, text, uuid, uuid) to anon, authenticated;
grant execute on function public.submit_launch_lead(text, text, uuid, uuid) to anon, authenticated;
grant execute on function english_city_private.record_launch_payment(uuid, text, integer) to authenticated;
grant execute on function public.record_launch_payment(uuid, text, integer) to authenticated;

commit;
