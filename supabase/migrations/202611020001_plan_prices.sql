-- New pricing: 7 000 ₸ per month; longer plans keep their discount against that base.
update public.plans set price = 7000,  old_price = null  where id = '00000000-0000-4000-8000-000000000001';
update public.plans set price = 17900, old_price = 21000 where id = '00000000-0000-4000-8000-000000000002';
update public.plans set price = 56900, old_price = 84000 where id = '00000000-0000-4000-8000-000000000003';
