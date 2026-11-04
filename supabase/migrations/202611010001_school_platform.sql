-- English City: online school with a catalog subscription, Kaspi QR payments
-- checked by an admin, YouTube lessons and tasks reviewed by the admin.
-- Safe to run on a fresh project and on one that ran the old demo schema.

-- ---------- legacy demo schema ----------
drop view if exists public.teacher_student_progress;
drop table if exists public.class_members cascade;
drop table if exists public.classes cascade;
drop table if exists public.submissions cascade;
drop table if exists public.lesson_progress cascade;
drop table if exists public.profiles cascade;
drop function if exists public.is_teacher_of(uuid) cascade;
drop function if exists public.handle_new_user() cascade;
drop type if exists public.submission_kind cascade;
drop type if exists public.submission_status cascade;
drop type if exists public.user_role cascade;
drop policy if exists "audio: student uploads own folder" on storage.objects;
drop policy if exists "audio: student or teacher reads" on storage.objects;

-- ---------- types ----------
create type public.app_role as enum ('student', 'admin');
create type public.task_kind as enum ('pronunciation', 'quiz', 'writing', 'vocabulary');
create type public.payment_status as enum ('pending', 'approved', 'rejected');
create type public.review_status as enum ('submitted', 'reviewed', 'needs_work');

-- ---------- people ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  email text not null default '',
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------- subscription ----------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_kk text not null default '',
  description text not null default '',
  description_kk text not null default '',
  days int not null check (days > 0),
  price int not null check (price >= 0),
  old_price int check (old_price is null or old_price >= 0),
  featured boolean not null default false,
  is_active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.payment_settings (
  id int primary key default 1 check (id = 1),
  qr_url text not null default '',
  recipient text not null default '',
  instructions text not null default '',
  instructions_kk text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.payment_settings (id) values (1);

create table public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  plan_title text not null default '',
  amount int not null default 0,
  days int not null default 0,
  payer_name text not null,
  payer_phone text not null,
  status public.payment_status not null default 'pending',
  admin_note text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index payment_requests_status_idx on public.payment_requests (status, created_at desc);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  payment_id uuid references public.payment_requests(id) on delete set null,
  note text not null default '',
  granted_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index subscriptions_student_idx on public.subscriptions (student_id, ends_at desc);

create function public.has_access(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where student_id = target and starts_at <= now() and ends_at > now()
  );
$$;

-- ---------- content ----------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  title_kk text not null default '',
  subtitle text not null default '',
  subtitle_kk text not null default '',
  description text not null default '',
  description_kk text not null default '',
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  category text not null default 'general' check (category in ('general', 'speaking', 'grammar', 'ielts', 'business')),
  glyph text not null default '',
  cover_url text not null default '',
  is_published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Lesson outline: readable by everyone so the catalog can show the programme.
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  sort int not null default 0,
  title text not null,
  title_kk text not null default '',
  summary text not null default '',
  summary_kk text not null default '',
  minutes int not null default 10,
  is_free boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index lessons_course_idx on public.lessons (course_id, sort);

-- Lesson materials and tasks: only for subscribers, free lessons and the admin.
create table public.lesson_materials (
  lesson_id uuid primary key references public.lessons(id) on delete cascade,
  video_url text not null default '',
  body text not null default '',
  body_kk text not null default ''
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  sort int not null default 0,
  kind public.task_kind not null,
  title text not null default '',
  prompt text not null default '',
  prompt_kk text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index tasks_lesson_idx on public.tasks (lesson_id, sort);

create function public.can_open_lesson(target_lesson uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.lessons l join public.courses c on c.id = l.course_id
    where l.id = target_lesson and l.is_published and c.is_published
      and (l.is_free or public.has_access(auth.uid()))
  );
$$;

-- ---------- learning ----------
create table public.lesson_progress (
  student_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

-- Auto-checked tasks (quiz, vocabulary): best result per student.
create table public.task_results (
  student_id uuid references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  score int not null,
  total int not null,
  updated_at timestamptz not null default now(),
  primary key (student_id, task_id)
);

-- Tasks the admin reviews (pronunciation, writing). One per student and task;
-- resubmitting resets the status to "submitted".
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  kind public.task_kind not null,
  answer jsonb not null default '{}'::jsonb,
  auto_score int,
  status public.review_status not null default 'submitted',
  score int check (score is null or score between 0 and 100),
  feedback text not null default '',
  feedback_audio_path text not null default '',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, task_id)
);
create index submissions_status_idx on public.submissions (status, updated_at desc);

-- ---------- triggers ----------
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Students may edit their name and phone, never their role or email.
-- (auth.uid() is null in the SQL editor, where the first admin is promoted.)
create function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.email := old.email;
  end if;
  return new;
end;
$$;
create trigger profiles_guard before update on public.profiles
for each row execute procedure public.guard_profile();

-- The price and term are copied from the plan, so a request can't be forged.
create function public.fill_payment_request() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.plans;
begin
  select * into p from public.plans where id = new.plan_id and is_active;
  if not found then raise exception 'Plan is not available'; end if;
  new.plan_title := p.title;
  new.amount := p.price;
  new.days := p.days;
  new.status := 'pending';
  new.admin_note := '';
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;
create trigger payment_requests_fill before insert on public.payment_requests
for each row execute procedure public.fill_payment_request();

-- A student's resubmission goes back to the review queue.
create function public.guard_submission() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    if tg_op = 'UPDATE' then
      new.created_at := old.created_at;
    end if;
    new.status := 'submitted';
    new.score := null;
    new.feedback := '';
    new.feedback_audio_path := '';
    new.reviewed_by := null;
    new.reviewed_at := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger submissions_guard before insert or update on public.submissions
for each row execute procedure public.guard_submission();

-- ---------- admin actions ----------
create function public.grant_access(target uuid, extra_days int, reason text default '', payment uuid default null)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare start_at timestamptz; end_at timestamptz;
begin
  if not public.is_admin() then raise exception 'Only admins can grant access'; end if;
  if extra_days <= 0 then raise exception 'Days must be positive'; end if;
  select greatest(now(), coalesce(max(ends_at), now())) into start_at
  from public.subscriptions where student_id = target;
  end_at := start_at + make_interval(days => extra_days);
  insert into public.subscriptions (student_id, starts_at, ends_at, payment_id, note, granted_by)
  values (target, start_at, end_at, payment, coalesce(reason, ''), auth.uid());
  return end_at;
end;
$$;

create function public.approve_payment(request uuid) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare r public.payment_requests; end_at timestamptz;
begin
  if not public.is_admin() then raise exception 'Only admins can approve payments'; end if;
  select * into r from public.payment_requests where id = request for update;
  if not found or r.status <> 'pending' then raise exception 'Request is not pending'; end if;
  end_at := public.grant_access(r.student_id, r.days, r.plan_title, r.id);
  update public.payment_requests
  set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  where id = request;
  return end_at;
end;
$$;

create function public.reject_payment(request uuid, note text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can reject payments'; end if;
  update public.payment_requests
  set status = 'rejected', admin_note = coalesce(note, ''), reviewed_by = auth.uid(), reviewed_at = now()
  where id = request and status = 'pending';
  if not found then raise exception 'Request is not pending'; end if;
end;
$$;

create function public.revoke_access(target uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Only admins can revoke access'; end if;
  update public.subscriptions set ends_at = now()
  where student_id = target and ends_at > now();
end;
$$;

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.payment_settings enable row level security;
alter table public.payment_requests enable row level security;
alter table public.subscriptions enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_materials enable row level security;
alter table public.tasks enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.task_results enable row level security;
alter table public.submissions enable row level security;

create policy "profiles: own or admin reads" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: own or admin updates" on public.profiles for update using (id = auth.uid() or public.is_admin());

create policy "plans: active are public" on public.plans for select using (is_active or public.is_admin());
create policy "plans: admin writes" on public.plans for all using (public.is_admin()) with check (public.is_admin());

create policy "payment settings: public" on public.payment_settings for select using (true);
create policy "payment settings: admin writes" on public.payment_settings for update using (public.is_admin());

create policy "payments: own or admin reads" on public.payment_requests for select using (student_id = auth.uid() or public.is_admin());
create policy "payments: student creates own" on public.payment_requests for insert with check (student_id = auth.uid());

create policy "subscriptions: own or admin reads" on public.subscriptions for select using (student_id = auth.uid() or public.is_admin());

create policy "courses: published are public" on public.courses for select using (is_published or public.is_admin());
create policy "courses: admin writes" on public.courses for all using (public.is_admin()) with check (public.is_admin());

create policy "lessons: outline is public" on public.lessons for select using (
  public.is_admin() or (is_published and exists (select 1 from public.courses c where c.id = course_id and c.is_published))
);
create policy "lessons: admin writes" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

create policy "materials: open lessons" on public.lesson_materials for select using (public.can_open_lesson(lesson_id));
create policy "materials: admin writes" on public.lesson_materials for all using (public.is_admin()) with check (public.is_admin());

create policy "tasks: open lessons" on public.tasks for select using (public.can_open_lesson(lesson_id));
create policy "tasks: admin writes" on public.tasks for all using (public.is_admin()) with check (public.is_admin());

create policy "progress: own" on public.lesson_progress for all using (student_id = auth.uid()) with check (student_id = auth.uid() and public.can_open_lesson(lesson_id));
create policy "progress: admin reads" on public.lesson_progress for select using (public.is_admin());

create policy "results: own" on public.task_results for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "results: admin reads" on public.task_results for select using (public.is_admin());

create policy "submissions: own reads" on public.submissions for select using (student_id = auth.uid() or public.is_admin());
create policy "submissions: own creates" on public.submissions for insert with check (
  student_id = auth.uid() and exists (select 1 from public.tasks t where t.id = task_id and public.can_open_lesson(t.lesson_id))
);
create policy "submissions: own or admin updates" on public.submissions for update using (student_id = auth.uid() or public.is_admin());

-- ---------- storage ----------
-- Voice recordings: <student id>/<file>. The admin's voice replies go in the
-- student's folder too, so the student can play them back.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-audio', 'student-audio', false, 10485760, array['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav'])
on conflict (id) do update set allowed_mime_types = excluded.allowed_mime_types, file_size_limit = excluded.file_size_limit;

-- Kaspi QR and course covers.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public-assets', 'public-assets', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy "audio: student uploads own folder" on storage.objects for insert to authenticated
with check (bucket_id = 'student-audio' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "audio: owner or admin reads" on storage.objects for select to authenticated
using (bucket_id = 'student-audio' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "assets: admin uploads" on storage.objects for insert to authenticated
with check (bucket_id = 'public-assets' and public.is_admin());
create policy "assets: admin updates" on storage.objects for update to authenticated
using (bucket_id = 'public-assets' and public.is_admin());
