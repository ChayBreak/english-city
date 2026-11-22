# English City WhatsApp campaign

Send ads and social posts to `/start`. The page introduces the courses, links to a free lesson, and asks visitors for their WhatsApp number. The form explains that the team will contact them on WhatsApp about their request. Each new number receives its own shareable link after submission.

## Referral offer

Each new student who joins through a personal link and makes a verified first payment adds 20 percentage points to the referrer's discount. Up to four friends count. The offer applies once, to the referrer's first monthly subscription. Agree on the amount before the referrer pays. After the first month, the regular rate applies.

| Verified friends | Discount | First month |
| ---: | ---: | ---: |
| 0 | 0% | ₸7,700 |
| 1 | 20% | ₸6,160 |
| 2 | 40% | ₸4,620 |
| 3 | 60% | ₸3,080 |
| 4 | 80% | ₸1,540 |

## Launch setup

1. Apply `supabase/migrations/20261122024416_whatsapp_referrals.sql` after the previous platform migrations. Deploy the React app with the existing public Supabase configuration. Without that configuration, the landing page is a demo and sends no numbers.
2. Sign in as an admin and open **WhatsApp leads**. Before sharing the page, submit a test signup and a second test signup through its link to confirm they reach the dashboard.
3. Share your site's `/start` URL. For each new lead, use the WhatsApp link in the admin list to follow up. Your team sends follow-ups from WhatsApp.

## Verify payments and apply the discount

1. Match the lead to the student's account and confirm that the student is new. For a standard-price payment, use the existing Kaspi approval flow. For a discounted payment, agree on the displayed amount over WhatsApp and collect that exact amount through the school's Kaspi process.
2. In **WhatsApp leads**, record the verified first payment using its unique Kaspi transaction reference and select the discount actually applied. This credits the student's referrer, if any, and locks the student's own first-month discount. A pending lead does not count.
3. If a discounted payment was collected outside the normal checkout, use **Students → Access** to grant the student 30 days. The referral dashboard records the payment verification and discount. The existing checkout continues to show the standard plan price and does not grant access from a referral record.
