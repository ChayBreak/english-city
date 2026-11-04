-- The school's Kaspi QR and payment link. Values already set in the admin panel are kept.
alter table public.payment_settings
  add column if not exists pay_url text not null default '';

update public.payment_settings set qr_url = '/kaspi-qr.png' where id = 1 and qr_url = '';
update public.payment_settings set pay_url = 'https://pay.kaspi.kz/pay/fnxqvpzh' where id = 1 and pay_url = '';
update public.payment_settings set recipient = 'English City (ИП НУРАХМЕТ)' where id = 1 and recipient in ('', 'English City');
