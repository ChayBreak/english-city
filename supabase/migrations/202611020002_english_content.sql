-- English versions of student-facing content, plus Kazakh task titles.
-- Empty means "show the Russian text".
alter table public.plans
  add column if not exists title_en text not null default '',
  add column if not exists description_en text not null default '';

alter table public.payment_settings
  add column if not exists instructions_en text not null default '';

alter table public.courses
  add column if not exists title_en text not null default '',
  add column if not exists subtitle_en text not null default '',
  add column if not exists description_en text not null default '';

alter table public.lessons
  add column if not exists title_en text not null default '',
  add column if not exists summary_en text not null default '';

alter table public.lesson_materials
  add column if not exists body_en text not null default '';

alter table public.tasks
  add column if not exists title_kk text not null default '',
  add column if not exists title_en text not null default '',
  add column if not exists prompt_en text not null default '';

-- Translations for the starter content, only where still empty (admin edits are kept).
update public.plans set title_en = '1 month' where id = '00000000-0000-4000-8000-000000000001' and title_en = '';
update public.plans set description_en = 'Try the format and complete your first course.' where id = '00000000-0000-4000-8000-000000000001' and description_en = '';
update public.plans set title_en = '3 months' where id = '00000000-0000-4000-8000-000000000002' and title_en = '';
update public.plans set description_en = 'The best option to move up one level.' where id = '00000000-0000-4000-8000-000000000002' and description_en = '';
update public.plans set title_en = '12 months' where id = '00000000-0000-4000-8000-000000000003' and title_en = '';
update public.plans set description_en = 'The whole path from A1 to B2 at your own pace.' where id = '00000000-0000-4000-8000-000000000003' and description_en = '';
update public.payment_settings set instructions_en = 'Open the Kaspi.kz app, tap “Kaspi QR” and scan the code. Check the amount and confirm the payment. After paying, come back to this page and enter the payer''s name and the phone number you paid from.' where id = 1 and instructions_en = '';
update public.courses set title_en = 'First Steps' where id = '00000000-0000-4000-8000-000000000200' and title_en = '';
update public.courses set subtitle_en = 'English from scratch: introductions, numbers, first phrases' where id = '00000000-0000-4000-8000-000000000200' and subtitle_en = '';
update public.courses set description_en = 'A course for complete beginners. Learn to say hello, talk about yourself and understand simple questions. You can listen to every word and repeat after the speaker.' where id = '00000000-0000-4000-8000-000000000200' and description_en = '';
update public.lessons set summary_en = 'Greetings and introducing yourself in three phrases.' where id = '00000000-0000-4000-8000-000000000201' and summary_en = '';
update public.lessons set title_en = 'Hello! Let''s meet' where id = '00000000-0000-4000-8000-000000000201' and title_en = '';
update public.lesson_materials set body_en = '## How to introduce yourself
In English, an introduction is built from three short phrases:
- **Hello! My name is Aruzhan.**
- **I''m from Almaty.**
- **Nice to meet you!**

Listen to each phrase, repeat it out loud and record yourself in the task below.' where lesson_id = '00000000-0000-4000-8000-000000000201' and body_en = '';
update public.tasks set title_kk = 'Танысу сөздері' where id = '00000000-0000-4000-8000-000000020101' and title_kk = '';
update public.tasks set title_en = 'Words for introductions' where id = '00000000-0000-4000-8000-000000020101' and title_en = '';
update public.tasks set prompt_en = 'Flip the card, listen to the word and mark whether you know it.' where id = '00000000-0000-4000-8000-000000020101' and prompt_en = '';
update public.tasks set title_kk = 'Өзіңіз туралы айтыңыз' where id = '00000000-0000-4000-8000-000000020102' and title_kk = '';
update public.tasks set title_en = 'Talk about yourself' where id = '00000000-0000-4000-8000-000000020102' and title_en = '';
update public.tasks set prompt_en = 'Listen to the phrase, record yourself and see which words were recognised.' where id = '00000000-0000-4000-8000-000000020102' and prompt_en = '';
update public.tasks set title_kk = 'Өзіңізді тексеріңіз' where id = '00000000-0000-4000-8000-000000020103' and title_kk = '';
update public.tasks set title_en = 'Check yourself' where id = '00000000-0000-4000-8000-000000020103' and title_en = '';
update public.tasks set prompt_en = 'Choose the correct option.' where id = '00000000-0000-4000-8000-000000020103' and prompt_en = '';
update public.lessons set summary_en = 'Numbers from 0 to 20 and how to say a phone number.' where id = '00000000-0000-4000-8000-000000000202' and summary_en = '';
update public.lessons set title_en = 'Numbers & phone numbers' where id = '00000000-0000-4000-8000-000000000202' and title_en = '';
update public.lesson_materials set body_en = '## Phone numbers in English
Say the digits one by one: **seven, seven, zero, one…** Zero is often read as **oh**. Two identical digits in a row can be said with **double**: 77 — **double seven**.' where lesson_id = '00000000-0000-4000-8000-000000000202' and body_en = '';
update public.tasks set title_kk = 'Сандар' where id = '00000000-0000-4000-8000-000000020201' and title_kk = '';
update public.tasks set title_en = 'Numbers' where id = '00000000-0000-4000-8000-000000020201' and title_en = '';
update public.tasks set prompt_en = 'Repeat the numbers out loud with the speaker.' where id = '00000000-0000-4000-8000-000000020201' and prompt_en = '';
update public.tasks set title_kk = 'Нөміріңізді айтыңыз' where id = '00000000-0000-4000-8000-000000020202' and title_kk = '';
update public.tasks set title_en = 'Say your number' where id = '00000000-0000-4000-8000-000000020202' and title_en = '';
update public.tasks set prompt_en = 'Say the number the way native speakers do.' where id = '00000000-0000-4000-8000-000000020202' and prompt_en = '';
update public.courses set title_en = 'Clear Pronunciation' where id = '00000000-0000-4000-8000-000000000300' and title_en = '';
update public.courses set subtitle_en = 'Sounds that don''t exist in Russian or Kazakh' where id = '00000000-0000-4000-8000-000000000300' and subtitle_en = '';
update public.courses set description_en = 'A pronunciation trainer: listen to the model, record yourself, instantly see which words were unclear, and get voice feedback from a teacher.' where id = '00000000-0000-4000-8000-000000000300' and description_en = '';
update public.lessons set summary_en = 'The dental sounds /θ/ and /ð/: think, this, three.' where id = '00000000-0000-4000-8000-000000000301' and summary_en = '';
update public.lessons set title_en = 'The TH sound' where id = '00000000-0000-4000-8000-000000000301' and title_en = '';
update public.lesson_materials set body_en = '## How to make the TH sound
The tip of your tongue peeks out slightly between your teeth, and air flows over it.
- **/θ/** — voiceless: think, three, thank you
- **/ð/** — voiced: this, that, mother

Don''t replace TH with “s”, “z” or “f” — the word can turn into a different one: **think → sink**.' where lesson_id = '00000000-0000-4000-8000-000000000301' and body_en = '';
update public.tasks set title_kk = 'TH дыбысы бар жаңылтпаштар' where id = '00000000-0000-4000-8000-000000030101' and title_kk = '';
update public.tasks set title_en = 'TH tongue twisters' where id = '00000000-0000-4000-8000-000000030101' and title_en = '';
update public.tasks set prompt_en = 'Listen at slow speed first, then record yourself.' where id = '00000000-0000-4000-8000-000000030101' and prompt_en = '';
update public.lessons set summary_en = 'Where to put the stress in long words.' where id = '00000000-0000-4000-8000-000000000302' and summary_en = '';
update public.lessons set title_en = 'Word stress' where id = '00000000-0000-4000-8000-000000000302' and title_en = '';
update public.lesson_materials set body_en = '## Stress changes meaning
In English, the stressed syllable is longer and louder, while unstressed ones sound short and unclear.
- **PREsent** — a gift, **preSENT** — to show or introduce
- **PHOtograph**, **phoTOgrapher**, **photoGRAPHic** — the stress “moves” along with the suffix.' where lesson_id = '00000000-0000-4000-8000-000000000302' and body_en = '';
update public.tasks set title_kk = 'Сөздердегі екпін' where id = '00000000-0000-4000-8000-000000030201' and title_kk = '';
update public.tasks set title_en = 'Stress in words' where id = '00000000-0000-4000-8000-000000030201' and title_en = '';
update public.tasks set prompt_en = 'Stress the key syllable with your voice.' where id = '00000000-0000-4000-8000-000000030201' and prompt_en = '';
update public.tasks set title_kk = 'Екпін қайда?' where id = '00000000-0000-4000-8000-000000030202' and title_kk = '';
update public.tasks set title_en = 'Where''s the stress?' where id = '00000000-0000-4000-8000-000000030202' and title_en = '';
update public.tasks set prompt_en = 'Choose the option with the correct stress.' where id = '00000000-0000-4000-8000-000000030202' and prompt_en = '';
update public.courses set title_en = 'Everyday English' where id = '00000000-0000-4000-8000-000000000100' and title_en = '';
update public.courses set subtitle_en = 'Stories, changes and confident speaking in the past tense' where id = '00000000-0000-4000-8000-000000000100' and subtitle_en = '';
update public.courses set description_en = 'A unit about new beginnings: vocabulary for talking about change, past simple and past continuous, reading, listening to a TED talk, and telling your own story out loud and in writing. A teacher checks the speaking and writing tasks.' where id = '00000000-0000-4000-8000-000000000100' and description_en = '';
update public.lessons set summary_en = 'When did you last try something new?' where id = '00000000-0000-4000-8000-000000000101' and summary_en = '';
update public.lessons set title_en = 'Start here' where id = '00000000-0000-4000-8000-000000000101' and title_en = '';
update public.lesson_materials set body_en = '## When did you last try something new?
In this unit you''ll talk about changes in life, understand other people''s stories and tell your own.

Watch a short talk: the speaker tried something new for 30 days in a row. Try to catch the main idea — we''ll look at the details later.' where lesson_id = '00000000-0000-4000-8000-000000000101' and body_en = '';
update public.tasks set title_kk = 'Дайындық' where id = '00000000-0000-4000-8000-000000010101' and title_kk = '';
update public.tasks set title_en = 'Warm-up' where id = '00000000-0000-4000-8000-000000010101' and title_en = '';
update public.tasks set prompt_en = 'Think of one thing you started recently. What made you begin? Write 2–3 sentences.' where id = '00000000-0000-4000-8000-000000010101' and prompt_en = '';
update public.lessons set summary_en = 'Phrases for talking about change.' where id = '00000000-0000-4000-8000-000000000102' and summary_en = '';
update public.lessons set title_en = 'People & routines' where id = '00000000-0000-4000-8000-000000000102' and title_en = '';
update public.lesson_materials set body_en = '## Build your word power
These phrases will help you talk about new experiences. Learn them as ready-made chunks — not word by word.' where lesson_id = '00000000-0000-4000-8000-000000000102' and body_en = '';
update public.tasks set title_kk = 'Бөлім тіркестері' where id = '00000000-0000-4000-8000-000000010201' and title_kk = '';
update public.tasks set title_en = 'Unit phrases' where id = '00000000-0000-4000-8000-000000010201' and title_en = '';
update public.tasks set prompt_en = 'Flip the card and repeat the phrase out loud.' where id = '00000000-0000-4000-8000-000000010201' and prompt_en = '';
update public.tasks set title_kk = 'Сөйлеудегі тіркестер' where id = '00000000-0000-4000-8000-000000010202' and title_kk = '';
update public.tasks set title_en = 'Phrases in speech' where id = '00000000-0000-4000-8000-000000010202' and title_en = '';
update public.tasks set prompt_en = 'Say each phrase as a whole, with a natural rhythm.' where id = '00000000-0000-4000-8000-000000010202' and prompt_en = '';
update public.lessons set summary_en = 'Past simple and past continuous in one story.' where id = '00000000-0000-4000-8000-000000000103' and summary_en = '';
update public.lessons set title_en = 'Stories in progress' where id = '00000000-0000-4000-8000-000000000103' and title_en = '';
update public.lesson_materials set body_en = '## Past simple + past continuous
- **Past continuous** — a background action that was in progress: **I was waiting for a bus.**
- **Past simple** — the event that interrupted it: **I saw a poster.**

Together: **While I was waiting for a bus, I saw a poster.**

## The -ed ending
In regular verbs, -ed is pronounced in three ways: **/t/** (noticed), **/d/** (learned), **/ɪd/** (started — after t and d).' where lesson_id = '00000000-0000-4000-8000-000000000103' and body_en = '';
update public.tasks set title_kk = '-ed жалғауы' where id = '00000000-0000-4000-8000-000000010301' and title_kk = '';
update public.tasks set title_en = 'The -ed ending' where id = '00000000-0000-4000-8000-000000010301' and title_en = '';
update public.tasks set prompt_en = 'Pay attention to the last sound of the verb.' where id = '00000000-0000-4000-8000-000000010301' and prompt_en = '';
update public.tasks set title_kk = 'Grammar practice' where id = '00000000-0000-4000-8000-000000010302' and title_kk = '';
update public.tasks set title_en = 'Grammar practice' where id = '00000000-0000-4000-8000-000000010302' and title_en = '';
update public.tasks set prompt_en = 'Choose the correct form.' where id = '00000000-0000-4000-8000-000000010302' and prompt_en = '';
update public.lessons set summary_en = 'Read Dana''s story: what changed her plans?' where id = '00000000-0000-4000-8000-000000000104' and summary_en = '';
update public.lessons set title_en = 'A new beginning' where id = '00000000-0000-4000-8000-000000000104' and title_en = '';
update public.lesson_materials set body_en = '## One decision, a new direction
Read the short story and answer the questions.

Last spring, Dana was working in a busy office in Astana. She liked her colleagues, but she felt that every day was the same. One evening, while she was waiting for a bus, she saw a poster for a weekend photography walk.

Dana nearly walked past it. Then she remembered the camera her grandfather had given her and signed up. During the walk, she met people who saw the city in a completely different way. Six months later, she still works at the same office — but now she also photographs local events. That rainy evening became a small turning point.' where lesson_id = '00000000-0000-4000-8000-000000000104' and body_en = '';
update public.tasks set title_kk = 'Reading check' where id = '00000000-0000-4000-8000-000000010401' and title_kk = '';
update public.tasks set title_en = 'Reading check' where id = '00000000-0000-4000-8000-000000010401' and title_en = '';
update public.tasks set prompt_en = 'Answer based on the text.' where id = '00000000-0000-4000-8000-000000010401' and prompt_en = '';
update public.lessons set summary_en = 'Listening to a TED talk and shadowing.' where id = '00000000-0000-4000-8000-000000000105' and summary_en = '';
update public.lessons set title_en = 'A 30-day experiment' where id = '00000000-0000-4000-8000-000000000105' and title_en = '';
update public.lesson_materials set body_en = '## Watch twice
The first time — for the main idea. The second time — with English subtitles, to answer the questions. Then repeat the key phrases out loud after the speaker.' where lesson_id = '00000000-0000-4000-8000-000000000105' and body_en = '';
update public.tasks set title_kk = 'Listening check' where id = '00000000-0000-4000-8000-000000010501' and title_kk = '';
update public.tasks set title_en = 'Listening check' where id = '00000000-0000-4000-8000-000000010501' and title_en = '';
update public.tasks set prompt_en = 'Answer after watching.' where id = '00000000-0000-4000-8000-000000010501' and prompt_en = '';
update public.tasks set title_kk = 'Shadowing' where id = '00000000-0000-4000-8000-000000010502' and title_kk = '';
update public.tasks set title_en = 'Shadowing' where id = '00000000-0000-4000-8000-000000010502' and title_en = '';
update public.tasks set prompt_en = 'Repeat the speaker''s key phrases with the same intonation.' where id = '00000000-0000-4000-8000-000000010502' and prompt_en = '';
update public.lessons set summary_en = 'A 60-second story about a first experience.' where id = '00000000-0000-4000-8000-000000000106' and summary_en = '';
update public.lessons set title_en = 'Tell your story' where id = '00000000-0000-4000-8000-000000000106' and title_en = '';
update public.lesson_materials set body_en = '## Your 60-second story
Tell us about a time you did something for the first time.
- **Set the scene** — where were you, what were you doing?
- **Describe the moment** — what happened, how did you feel?
- **Reflect** — what did it teach you?

First practise the model story below — a teacher will listen and give you tips.' where lesson_id = '00000000-0000-4000-8000-000000000106' and body_en = '';
update public.tasks set title_kk = 'Үлгі әңгіме' where id = '00000000-0000-4000-8000-000000010601' and title_kk = '';
update public.tasks set title_en = 'Model story' where id = '00000000-0000-4000-8000-000000010601' and title_en = '';
update public.tasks set prompt_en = 'Read the story phrase by phrase.' where id = '00000000-0000-4000-8000-000000010601' and prompt_en = '';
update public.lessons set summary_en = 'A written story of 100–120 words.' where id = '00000000-0000-4000-8000-000000000107' and summary_en = '';
update public.lessons set title_en = 'An unforgettable day' where id = '00000000-0000-4000-8000-000000000107' and title_en = '';
update public.lesson_materials set body_en = '## Write: An unforgettable day
Write 100–120 words. Use time expressions and both past tenses.

Useful linkers: **At first… / While I was… / Suddenly… / In the end…**' where lesson_id = '00000000-0000-4000-8000-000000000107' and body_en = '';
update public.tasks set title_kk = 'Your story' where id = '00000000-0000-4000-8000-000000010701' and title_kk = '';
update public.tasks set title_en = 'Your story' where id = '00000000-0000-4000-8000-000000010701' and title_en = '';
update public.tasks set prompt_en = 'Write about an unforgettable day in your life.' where id = '00000000-0000-4000-8000-000000010701' and prompt_en = '';
update public.lessons set summary_en = 'Final test for the unit.' where id = '00000000-0000-4000-8000-000000000108' and summary_en = '';
update public.lessons set title_en = 'Checkpoint' where id = '00000000-0000-4000-8000-000000000108' and title_en = '';
update public.lesson_materials set body_en = '## Unit checkpoint
A short test on grammar, reading and listening. You can take it as many times as you like — your best result is saved.' where lesson_id = '00000000-0000-4000-8000-000000000108' and body_en = '';
update public.tasks set title_kk = 'Unit check' where id = '00000000-0000-4000-8000-000000010801' and title_kk = '';
update public.tasks set title_en = 'Unit check' where id = '00000000-0000-4000-8000-000000010801' and title_en = '';
update public.courses set title_en = 'Business English' where id = '00000000-0000-4000-8000-000000000400' and title_en = '';
update public.courses set subtitle_en = 'Emails, calls and small talk with colleagues' where id = '00000000-0000-4000-8000-000000000400' and subtitle_en = '';
update public.courses set description_en = 'For people who work with international colleagues: polite emails, taking part in meetings, clarifying and making requests. A teacher checks the writing tasks.' where id = '00000000-0000-4000-8000-000000000400' and description_en = '';
update public.lessons set summary_en = 'How to ask, remind and say no politely.' where id = '00000000-0000-4000-8000-000000000401' and summary_en = '';
update public.lessons set title_en = 'Polite emails' where id = '00000000-0000-4000-8000-000000000401' and title_en = '';
update public.lesson_materials set body_en = '## Softening a request
Instead of **Send me the report** — **Could you send me the report by Friday?**

Instead of **You forgot** — **Just a quick reminder about…**

Instead of **No** — **Unfortunately, I won''t be able to… Would Thursday work instead?**' where lesson_id = '00000000-0000-4000-8000-000000000401' and body_en = '';
update public.tasks set title_kk = 'Хаттарға арналған тіркестер' where id = '00000000-0000-4000-8000-000000040101' and title_kk = '';
update public.tasks set title_en = 'Email phrases' where id = '00000000-0000-4000-8000-000000040101' and title_en = '';
update public.tasks set title_kk = 'Хат жазыңыз' where id = '00000000-0000-4000-8000-000000040102' and title_kk = '';
update public.tasks set title_en = 'Write an email' where id = '00000000-0000-4000-8000-000000040102' and title_en = '';
update public.tasks set prompt_en = 'Your manager asked for a report by Monday, but you need two more days. Write a polite email (60–90 words).' where id = '00000000-0000-4000-8000-000000040102' and prompt_en = '';
