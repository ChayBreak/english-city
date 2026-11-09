# Pre-Intermediate course release

The course formerly displayed as Everyday English is now Pre-Intermediate Course. Its ID and `everyday-english-b1` URL remain stable for existing links and references. The database level remains B1 because the current application only supports single CEFR levels; the visible subtitle explains the A2 → B1 progression.

The first three units follow Cutting Edge third edition's sequence, with original English City content. There are 18 published lessons, vocabulary and pronunciation activities, three ten-question checkpoints, and teacher-reviewed written responses. Free-speaking activities are in the lesson text; learners can submit scripts through writing tasks. Dialogues are clearly labelled as transcript practice because recordings are not yet available. English is the instructional language with Russian support; complete Kazakh localization remains outstanding.

The editorial source is `pre-intermediate-units-1-3.md`. Rebuild the native lessons with `node scripts/build-pre-intermediate.mjs`, then run `npm run seed:sql`. The answer key stays in this editorial file; it is not included in the lesson material. Checkpoint answers are provided by the quiz feedback.

## Existing installations

Apply the new `pre_intermediate_and_monthly_price` migration to an existing Supabase project. Fresh installations should apply all migrations and then seed. The migration archives the known previous starter lessons without deleting submissions/progress; it updates the monthly plan to 7,700 tenge without modifying existing payment amounts. Additional admin-created lessons are preserved. Browser demo data upgrades version 5 to 6 while keeping users, sessions, payments and submissions.

## Email registration

Signup now asks only for email and password. Name and phone can be filled in later in Account. New passwords are restricted to 4–8 characters, without a character-class rule. Login has no new length restriction, so existing passwords still work.

Production prerequisites: enable Email/password signup in Supabase Auth; set the minimum password length to 4 and required character classes to none if the hosted project permits that configuration. The application's validation cannot override a stricter hosted Auth policy. If the provider refuses a minimum of 4, obtain an agreed supported minimum before publication; do not silently transform or pad passwords. Email confirmation, SMTP and redirect URLs must be configured for the deployed domain. No hosted Auth setting has been changed or live signup verified as part of this repository update.

## Checks

Run `npm test`, `npm run lint`, `npm run build`, and `npm run seed:sql`. Test live signup and apply the SQL migration on the intended project before confirming the production release. Pushing Git does not itself run a Supabase migration.
