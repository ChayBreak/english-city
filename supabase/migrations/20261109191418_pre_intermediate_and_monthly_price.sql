-- Original English City lessons; existing student work and payment snapshots are preserved.
begin;
insert into public.courses (id, slug, title, title_kk, title_en, subtitle, subtitle_kk, subtitle_en, description, description_kk, description_en, level, category, glyph, cover_url, is_published, sort) values ('00000000-0000-4000-8000-000000000100', 'everyday-english-b1', 'Pre-Intermediate Course', 'Pre-Intermediate Course', 'Pre-Intermediate Course', 'Досуг и спорт, первый опыт, работа и отдых · A2 → B1', 'Бос уақыт пен спорт, алғашқы тәжірибе, жұмыс пен демалыс · A2 → B1', 'Leisure and sport, first experiences, work and rest · A2 → B1', '18 уроков в трёх разделах по последовательности Cutting Edge Third Edition: оригинальные тексты, словарь, грамматика, произношение, тесты и письменные задания. Основной материал на английском с русскими подсказками. Диалоги пока доступны как тексты без аудио.', 'Cutting Edge Third Edition ретіне негізделген үш бөлімдегі 18 сабақ: түпнұсқа мәтіндер, сөздік, грамматика, айтылым, тесттер және жазба тапсырмалар. Негізгі материал ағылшынша, орысша көмекпен. Диалогтар әзірге аудиосыз мәтін түрінде берілген.', '18 original lessons in three units following the Cutting Edge Third Edition sequence. Practise vocabulary, grammar, pronunciation, reading and writing, with unit quizzes and teacher-reviewed responses. Dialogues currently have transcripts only. Core material is English with Russian support.', 'B1', 'general', 'New', '', true, 3) on conflict (id) do update set slug = excluded.slug, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, subtitle = excluded.subtitle, subtitle_kk = excluded.subtitle_kk, subtitle_en = excluded.subtitle_en, description = excluded.description, description_kk = excluded.description_kk, description_en = excluded.description_en, level = excluded.level, category = excluded.category, glyph = excluded.glyph, cover_url = excluded.cover_url, is_published = excluded.is_published, sort = excluded.sort;
update public.plans set price = 7700 where id = '00000000-0000-4000-8000-000000000001';
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001001', '00000000-0000-4000-8000-000000000100', 1, '1.1 What do you do for fun?', '1.1 What do you do for fun?', '1.1 What do you do for fun?', 'use twelve useful phrases to describe your interests.', 'use twelve useful phrases to describe your interests.', 'use twelve useful phrases to describe your interests.', 30, true, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001001', '', 'Goal: use twelve useful phrases to describe your interests.

Warm-up: Name one activity you enjoy, one you dislike and one you want to try. You can answer with a phrase first.

- **go for a walk** — ходить на прогулку. I go for a walk after dinner.
- **go swimming** — заниматься плаванием. We go swimming on Saturdays.
- **go cycling** — кататься на велосипеде. I go cycling with my cousin.
- **play football** — играть в футбол. They play football after work.
- **play board games** — играть в настольные игры. We play board games at home.
- **do yoga** — заниматься йогой. She does yoga in the morning.
- **do exercise** — заниматься физическими упражнениями. I do exercise three times a week.
- **take photos** — фотографировать. He takes photos of the city.
- **listen to podcasts** — слушать подкасты. I listen to podcasts on the bus.
- **meet friends** — встречаться с друзьями. I meet friends at the weekend.
- **stay in** — оставаться дома. We stay in on Friday evenings.
- **try something new** — пробовать новое. I try something new every month.

Notice: **play** + many games/sports; **go** + many -ing activities; **do** + yoga/exercise. Learn complete phrases rather than treating these as rules without exceptions.

Practice A: Complete with play, go or do: 1 ___ football; 2 ___ cycling; 3 ___ yoga; 4 ___ swimming; 5 ___ board games; 6 ___ exercise.

Practice B: Complete personally: “After work/classes, I usually …”; “At the weekend, I like to …”; “I want to try … because …”.

Speaking: Record 30–45 seconds about three free-time activities. Include who you do them with and where.', 'Goal: use twelve useful phrases to describe your interests.

Warm-up: Name one activity you enjoy, one you dislike and one you want to try. You can answer with a phrase first.

- **go for a walk** — ходить на прогулку. I go for a walk after dinner.
- **go swimming** — заниматься плаванием. We go swimming on Saturdays.
- **go cycling** — кататься на велосипеде. I go cycling with my cousin.
- **play football** — играть в футбол. They play football after work.
- **play board games** — играть в настольные игры. We play board games at home.
- **do yoga** — заниматься йогой. She does yoga in the morning.
- **do exercise** — заниматься физическими упражнениями. I do exercise three times a week.
- **take photos** — фотографировать. He takes photos of the city.
- **listen to podcasts** — слушать подкасты. I listen to podcasts on the bus.
- **meet friends** — встречаться с друзьями. I meet friends at the weekend.
- **stay in** — оставаться дома. We stay in on Friday evenings.
- **try something new** — пробовать новое. I try something new every month.

Notice: **play** + many games/sports; **go** + many -ing activities; **do** + yoga/exercise. Learn complete phrases rather than treating these as rules without exceptions.

Practice A: Complete with play, go or do: 1 ___ football; 2 ___ cycling; 3 ___ yoga; 4 ___ swimming; 5 ___ board games; 6 ___ exercise.

Practice B: Complete personally: “After work/classes, I usually …”; “At the weekend, I like to …”; “I want to try … because …”.

Speaking: Record 30–45 seconds about three free-time activities. Include who you do them with and where.', 'Goal: use twelve useful phrases to describe your interests.

Warm-up: Name one activity you enjoy, one you dislike and one you want to try. You can answer with a phrase first.

- **go for a walk** — ходить на прогулку. I go for a walk after dinner.
- **go swimming** — заниматься плаванием. We go swimming on Saturdays.
- **go cycling** — кататься на велосипеде. I go cycling with my cousin.
- **play football** — играть в футбол. They play football after work.
- **play board games** — играть в настольные игры. We play board games at home.
- **do yoga** — заниматься йогой. She does yoga in the morning.
- **do exercise** — заниматься физическими упражнениями. I do exercise three times a week.
- **take photos** — фотографировать. He takes photos of the city.
- **listen to podcasts** — слушать подкасты. I listen to podcasts on the bus.
- **meet friends** — встречаться с друзьями. I meet friends at the weekend.
- **stay in** — оставаться дома. We stay in on Friday evenings.
- **try something new** — пробовать новое. I try something new every month.

Notice: **play** + many games/sports; **go** + many -ing activities; **do** + yoga/exercise. Learn complete phrases rather than treating these as rules without exceptions.

Practice A: Complete with play, go or do: 1 ___ football; 2 ___ cycling; 3 ___ yoga; 4 ___ swimming; 5 ___ board games; 6 ___ exercise.

Practice B: Complete personally: “After work/classes, I usually …”; “At the weekend, I like to …”; “I want to try … because …”.

Speaking: Record 30–45 seconds about three free-time activities. Include who you do them with and where.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200000', '00000000-0000-4000-8000-000000001001', 1, 'vocabulary', 'Useful phrases', 'Useful phrases', 'Useful phrases', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', '{"words":[{"term":"go for a walk","ru":"ходить на прогулку","kk":"","example":"I go for a walk after dinner."},{"term":"go swimming","ru":"заниматься плаванием","kk":"","example":"We go swimming on Saturdays."},{"term":"go cycling","ru":"кататься на велосипеде","kk":"","example":"I go cycling with my cousin."},{"term":"play football","ru":"играть в футбол","kk":"","example":"They play football after work."},{"term":"play board games","ru":"играть в настольные игры","kk":"","example":"We play board games at home."},{"term":"do yoga","ru":"заниматься йогой","kk":"","example":"She does yoga in the morning."},{"term":"do exercise","ru":"заниматься физическими упражнениями","kk":"","example":"I do exercise three times a week."},{"term":"take photos","ru":"фотографировать","kk":"","example":"He takes photos of the city."},{"term":"listen to podcasts","ru":"слушать подкасты","kk":"","example":"I listen to podcasts on the bus."},{"term":"meet friends","ru":"встречаться с друзьями","kk":"","example":"I meet friends at the weekend."},{"term":"stay in","ru":"оставаться дома","kk":"","example":"We stay in on Friday evenings."},{"term":"try something new","ru":"пробовать новое","kk":"","example":"I try something new every month."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200001', '00000000-0000-4000-8000-000000001001', 2, 'pronunciation', 'Say it clearly', 'Say it clearly', 'Say it clearly', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', '{"phrases":[{"text":"I go for a walk after dinner."},{"text":"We go swimming on Saturdays."},{"text":"I go cycling with my cousin."},{"text":"They play football after work."},{"text":"We play board games at home."},{"text":"She does yoga in the morning."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200002', '00000000-0000-4000-8000-000000001001', 3, 'writing', 'Your response', 'Your response', 'Your response', 'Record 30–45 seconds about three free-time activities. Include who you do them with and where.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Record 30–45 seconds about three free-time activities. Include who you do them with and where.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Record 30–45 seconds about three free-time activities. Include who you do them with and where.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001002', '00000000-0000-4000-8000-000000000100', 2, '1.2 A week that works', '1.2 A week that works', '1.2 A week that works', 'describe routines with the present simple and frequency expressions.', 'describe routines with the present simple and frequency expressions.', 'describe routines with the present simple and frequency expressions.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001002', '', 'Goal: describe routines with the present simple and frequency expressions.

Read:

> My name is Dana. I work in a bookshop, so I spend a lot of time indoors. On Tuesdays, I go swimming before work. My friend Ayan comes with me, but he doesn''t swim for long. He prefers the café! We usually meet friends on Friday evenings. I sometimes stay in and play board games with my sister. She studies at university and doesn''t have much free time. On Sundays, we both put our phones away and go for a walk. We don''t do anything expensive, but we always have something to talk about.

Check: 1 Where does Dana work? 2 When does she swim? 3 Does Ayan swim for a long time? 4 Who plays board games with Dana? 5 What do the sisters do on Sundays?

Language:
- I/you/we/they **play**. He/she **plays**.
- I **don''t play**. She **doesn''t play**. Not “doesn''t plays”.
- **Do** you play? **Does** she play?
- I **usually walk**. She **is often busy**. Frequency adverbs normally go before the main verb, but after be.
- once a week; twice a month; three times a week; every day.

Russian support: Present simple описывает привычки и регулярные действия. После does/doesn''t основной глагол используется без -s.

Practice: 1 Dana ___ (work) in a bookshop. 2 Her sister ___ (not/have) much free time. 3 ___ Ayan ___ (prefer) the café? 4 They ___ (not/do) expensive activities. 5 Put in order: often / is / tired / he. 6 Correct: “She goes swimming twice week.”

Write: Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.', 'Goal: describe routines with the present simple and frequency expressions.

Read:

> My name is Dana. I work in a bookshop, so I spend a lot of time indoors. On Tuesdays, I go swimming before work. My friend Ayan comes with me, but he doesn''t swim for long. He prefers the café! We usually meet friends on Friday evenings. I sometimes stay in and play board games with my sister. She studies at university and doesn''t have much free time. On Sundays, we both put our phones away and go for a walk. We don''t do anything expensive, but we always have something to talk about.

Check: 1 Where does Dana work? 2 When does she swim? 3 Does Ayan swim for a long time? 4 Who plays board games with Dana? 5 What do the sisters do on Sundays?

Language:
- I/you/we/they **play**. He/she **plays**.
- I **don''t play**. She **doesn''t play**. Not “doesn''t plays”.
- **Do** you play? **Does** she play?
- I **usually walk**. She **is often busy**. Frequency adverbs normally go before the main verb, but after be.
- once a week; twice a month; three times a week; every day.

Russian support: Present simple описывает привычки и регулярные действия. После does/doesn''t основной глагол используется без -s.

Practice: 1 Dana ___ (work) in a bookshop. 2 Her sister ___ (not/have) much free time. 3 ___ Ayan ___ (prefer) the café? 4 They ___ (not/do) expensive activities. 5 Put in order: often / is / tired / he. 6 Correct: “She goes swimming twice week.”

Write: Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.', 'Goal: describe routines with the present simple and frequency expressions.

Read:

> My name is Dana. I work in a bookshop, so I spend a lot of time indoors. On Tuesdays, I go swimming before work. My friend Ayan comes with me, but he doesn''t swim for long. He prefers the café! We usually meet friends on Friday evenings. I sometimes stay in and play board games with my sister. She studies at university and doesn''t have much free time. On Sundays, we both put our phones away and go for a walk. We don''t do anything expensive, but we always have something to talk about.

Check: 1 Where does Dana work? 2 When does she swim? 3 Does Ayan swim for a long time? 4 Who plays board games with Dana? 5 What do the sisters do on Sundays?

Language:
- I/you/we/they **play**. He/she **plays**.
- I **don''t play**. She **doesn''t play**. Not “doesn''t plays”.
- **Do** you play? **Does** she play?
- I **usually walk**. She **is often busy**. Frequency adverbs normally go before the main verb, but after be.
- once a week; twice a month; three times a week; every day.

Russian support: Present simple описывает привычки и регулярные действия. После does/doesn''t основной глагол используется без -s.

Practice: 1 Dana ___ (work) in a bookshop. 2 Her sister ___ (not/have) much free time. 3 ___ Ayan ___ (prefer) the café? 4 They ___ (not/do) expensive activities. 5 Put in order: often / is / tired / he. 6 Correct: “She goes swimming twice week.”

Write: Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200010', '00000000-0000-4000-8000-000000001002', 1, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.', 'Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.', 'Describe your real week in 60–80 words. Use four activity phrases and three different frequency expressions.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001003', '00000000-0000-4000-8000-000000000100', 3, '1.3 Ask one more question', '1.3 Ask one more question', '1.3 Ask one more question', 'ask accurate questions and keep a short conversation going.', 'ask accurate questions and keep a short conversation going.', 'ask accurate questions and keep a short conversation going.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001003', '', 'Goal: ask accurate questions and keep a short conversation going.

Models:
- What do you do in your free time?
- How often do you go cycling?
- Where does your friend play football?
- Who do you go with?
- Are you interested in photography?
- Can you swim?

Pattern: question word + do/does + subject + main verb. With **be** and **can**, invert directly: “Are you …?” / “Can you …?”

Repair: 1 What you do after work? 2 How often does she plays tennis? 3 Do you are tired after exercise? 4 Does he can swim?

Build: 5 where / your friends / play football? 6 what / you / do / on Sundays?

Conversation:
> A: What do you do in your free time?
> B: I take photos.
> A: Oh, really? What do you usually photograph?
> B: Buildings and street markets.
> A: Who do you go with?

Pronunciation: Stress the key information: “How OFTEN do you go SWIMMING?” Listen for unstressed do/you. Practise clearly before increasing speed; accent imitation is not the goal.

Task: Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.', 'Goal: ask accurate questions and keep a short conversation going.

Models:
- What do you do in your free time?
- How often do you go cycling?
- Where does your friend play football?
- Who do you go with?
- Are you interested in photography?
- Can you swim?

Pattern: question word + do/does + subject + main verb. With **be** and **can**, invert directly: “Are you …?” / “Can you …?”

Repair: 1 What you do after work? 2 How often does she plays tennis? 3 Do you are tired after exercise? 4 Does he can swim?

Build: 5 where / your friends / play football? 6 what / you / do / on Sundays?

Conversation:
> A: What do you do in your free time?
> B: I take photos.
> A: Oh, really? What do you usually photograph?
> B: Buildings and street markets.
> A: Who do you go with?

Pronunciation: Stress the key information: “How OFTEN do you go SWIMMING?” Listen for unstressed do/you. Practise clearly before increasing speed; accent imitation is not the goal.

Task: Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.', 'Goal: ask accurate questions and keep a short conversation going.

Models:
- What do you do in your free time?
- How often do you go cycling?
- Where does your friend play football?
- Who do you go with?
- Are you interested in photography?
- Can you swim?

Pattern: question word + do/does + subject + main verb. With **be** and **can**, invert directly: “Are you …?” / “Can you …?”

Repair: 1 What you do after work? 2 How often does she plays tennis? 3 Do you are tired after exercise? 4 Does he can swim?

Build: 5 where / your friends / play football? 6 what / you / do / on Sundays?

Conversation:
> A: What do you do in your free time?
> B: I take photos.
> A: Oh, really? What do you usually photograph?
> B: Buildings and street markets.
> A: Who do you go with?

Pronunciation: Stress the key information: “How OFTEN do you go SWIMMING?” Listen for unstressed do/you. Practise clearly before increasing speed; accent imitation is not the goal.

Task: Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200020', '00000000-0000-4000-8000-000000001003', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Prepare six questions for a 60-second interview. Use at least two follow-up questions. With a partner, record the conversation; alone, record questions and your own answers in two roles.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001004', '00000000-0000-4000-8000-000000000100', 4, '1.4 Find your weekend activity', '1.4 Find your weekend activity', '1.4 Find your weekend activity', 'understand short activity advertisements and choose a suitable option.', 'understand short activity advertisements and choose a suitable option.', 'understand short activity advertisements and choose a suitable option.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001004', '', 'Goal: understand short activity advertisements and choose a suitable option.

Read:
> **A · Saturday photo walk.** Meet outside Central Library at 10 a.m. Walk for 90 minutes and take photos of interesting buildings. Beginners are welcome. A phone camera is enough. Free. Bring comfortable shoes.
>
> **B · Evening board-game club.** Fridays, 7–9 p.m., at Riverside Café. Come alone or bring a friend. We explain the games before we start. Entry is free, but please buy a drink. No booking needed.
>
> **C · Beginner badminton.** Sundays, 8–9 a.m., at West Sports Centre. The session costs 2,000 tenge. Equipment is included. Book by Saturday afternoon. You don''t need experience.

Match: 1 A person who is only free on Friday evening. 2 A person with no sports equipment who wants exercise. 3 A person who wants a free outdoor activity. 4 A person who cannot book in advance and prefers an indoor activity.

Details: 5 Which activity starts earliest? 6 Where must you buy something? 7 What should you bring to the photo walk?

Task: Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.', 'Goal: understand short activity advertisements and choose a suitable option.

Read:
> **A · Saturday photo walk.** Meet outside Central Library at 10 a.m. Walk for 90 minutes and take photos of interesting buildings. Beginners are welcome. A phone camera is enough. Free. Bring comfortable shoes.
>
> **B · Evening board-game club.** Fridays, 7–9 p.m., at Riverside Café. Come alone or bring a friend. We explain the games before we start. Entry is free, but please buy a drink. No booking needed.
>
> **C · Beginner badminton.** Sundays, 8–9 a.m., at West Sports Centre. The session costs 2,000 tenge. Equipment is included. Book by Saturday afternoon. You don''t need experience.

Match: 1 A person who is only free on Friday evening. 2 A person with no sports equipment who wants exercise. 3 A person who wants a free outdoor activity. 4 A person who cannot book in advance and prefers an indoor activity.

Details: 5 Which activity starts earliest? 6 Where must you buy something? 7 What should you bring to the photo walk?

Task: Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.', 'Goal: understand short activity advertisements and choose a suitable option.

Read:
> **A · Saturday photo walk.** Meet outside Central Library at 10 a.m. Walk for 90 minutes and take photos of interesting buildings. Beginners are welcome. A phone camera is enough. Free. Bring comfortable shoes.
>
> **B · Evening board-game club.** Fridays, 7–9 p.m., at Riverside Café. Come alone or bring a friend. We explain the games before we start. Entry is free, but please buy a drink. No booking needed.
>
> **C · Beginner badminton.** Sundays, 8–9 a.m., at West Sports Centre. The session costs 2,000 tenge. Equipment is included. Book by Saturday afternoon. You don''t need experience.

Match: 1 A person who is only free on Friday evening. 2 A person with no sports equipment who wants exercise. 3 A person who wants a free outdoor activity. 4 A person who cannot book in advance and prefers an indoor activity.

Details: 5 Which activity starts earliest? 6 Where must you buy something? 7 What should you bring to the photo walk?

Task: Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200030', '00000000-0000-4000-8000-000000001004', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Recommend an option to a friend: “I think … is good for you because … . It starts … . You need … .” These advertisements are fictional learning material, not real local listings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001005', '00000000-0000-4000-8000-000000000100', 5, '1.5 Two friends, one plan', '1.5 Two friends, one plan', '1.5 Two friends, one plan', 'identify preferences and practical details in a conversation.', 'identify preferences and practical details in a conversation.', 'identify preferences and practical details in a conversation.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001005', '', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: identify preferences and practical details in a conversation.

Before reading: Which matters most when you choose an activity: price, time, place or company?

First reading: What do the friends choose?
Second reading: 1 Is Mira free on Saturday morning? 2 Why doesn''t she want badminton? 3 Where is the chosen activity? 4 What time do they agree to meet? 5 What does Mira bring?

Recording script:
> **Ayan:** Do you want to try something new this weekend?
> **Mira:** Yes, but I work on Saturday morning.
> **Ayan:** What about badminton on Sunday? It starts at eight.
> **Mira:** Eight is too early for me. I usually get up at nine on Sundays!
> **Ayan:** Fair enough. There''s a board-game club on Friday evening at Riverside Café.
> **Mira:** That sounds good. Do we need to book?
> **Ayan:** No. It starts at seven. Let''s meet outside at quarter to seven.
> **Mira:** Great. I have a new game at home. I''ll bring it.
> **Ayan:** Nice! I don''t know many games, so you can teach me.

Useful responses: “That sounds good”; “What about …?”; “Fair enough”; “How about you?” Treat “I''ll bring it” as a useful phrase here; a full future-forms lesson comes later.

Speaking: Make a different plan together. Agree on an activity, day, time and place.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: identify preferences and practical details in a conversation.

Before reading: Which matters most when you choose an activity: price, time, place or company?

First reading: What do the friends choose?
Second reading: 1 Is Mira free on Saturday morning? 2 Why doesn''t she want badminton? 3 Where is the chosen activity? 4 What time do they agree to meet? 5 What does Mira bring?

Recording script:
> **Ayan:** Do you want to try something new this weekend?
> **Mira:** Yes, but I work on Saturday morning.
> **Ayan:** What about badminton on Sunday? It starts at eight.
> **Mira:** Eight is too early for me. I usually get up at nine on Sundays!
> **Ayan:** Fair enough. There''s a board-game club on Friday evening at Riverside Café.
> **Mira:** That sounds good. Do we need to book?
> **Ayan:** No. It starts at seven. Let''s meet outside at quarter to seven.
> **Mira:** Great. I have a new game at home. I''ll bring it.
> **Ayan:** Nice! I don''t know many games, so you can teach me.

Useful responses: “That sounds good”; “What about …?”; “Fair enough”; “How about you?” Treat “I''ll bring it” as a useful phrase here; a full future-forms lesson comes later.

Speaking: Make a different plan together. Agree on an activity, day, time and place.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: identify preferences and practical details in a conversation.

Before reading: Which matters most when you choose an activity: price, time, place or company?

First reading: What do the friends choose?
Second reading: 1 Is Mira free on Saturday morning? 2 Why doesn''t she want badminton? 3 Where is the chosen activity? 4 What time do they agree to meet? 5 What does Mira bring?

Recording script:
> **Ayan:** Do you want to try something new this weekend?
> **Mira:** Yes, but I work on Saturday morning.
> **Ayan:** What about badminton on Sunday? It starts at eight.
> **Mira:** Eight is too early for me. I usually get up at nine on Sundays!
> **Ayan:** Fair enough. There''s a board-game club on Friday evening at Riverside Café.
> **Mira:** That sounds good. Do we need to book?
> **Ayan:** No. It starts at seven. Let''s meet outside at quarter to seven.
> **Mira:** Great. I have a new game at home. I''ll bring it.
> **Ayan:** Nice! I don''t know many games, so you can teach me.

Useful responses: “That sounds good”; “What about …?”; “Fair enough”; “How about you?” Treat “I''ll bring it” as a useful phrase here; a full future-forms lesson comes later.

Speaking: Make a different plan together. Agree on an activity, day, time and place.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200040', '00000000-0000-4000-8000-000000001005', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Make a different plan together. Agree on an activity, day, time and place.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Make a different plan together. Agree on an activity, day, time and place.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Make a different plan together. Agree on an activity, day, time and place.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001006', '00000000-0000-4000-8000-000000000100', 6, '1.6 Your free-time profile', '1.6 Your free-time profile', '1.6 Your free-time profile', 'Unit 1 checkpoint and project.', 'Unit 1 checkpoint and project.', 'Unit 1 checkpoint and project.', 40, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001006', '', 'Quiz, one point each:
1 She ___ yoga every morning. (do / does / goes)
2 ___ you play any sports? (Do / Does / Are)
3 How often ___ your brother go swimming? (do / does / is)
4 We ___ watch sport on TV. (don''t / doesn''t / aren''t)
5 Put in order: usually / I / in / stay / on Mondays.
6 Correct: “He doesn''t likes football.”
7 Make a question: you / interested / in music?
8 “Twice a week” means: two times each week / every two weeks.
9 Complete: I ___ photos of buildings. (take / do / play)
10 Write a follow-up question to: “I go cycling at the weekend.”

Final speaking: Record a 60–90 second interview or profile. Include interests, frequency, company and one recommended new activity.

Final writing: Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.

Self-check: I can talk about habits; ask questions; understand an activity advertisement; agree on a plan.', 'Quiz, one point each:
1 She ___ yoga every morning. (do / does / goes)
2 ___ you play any sports? (Do / Does / Are)
3 How often ___ your brother go swimming? (do / does / is)
4 We ___ watch sport on TV. (don''t / doesn''t / aren''t)
5 Put in order: usually / I / in / stay / on Mondays.
6 Correct: “He doesn''t likes football.”
7 Make a question: you / interested / in music?
8 “Twice a week” means: two times each week / every two weeks.
9 Complete: I ___ photos of buildings. (take / do / play)
10 Write a follow-up question to: “I go cycling at the weekend.”

Final speaking: Record a 60–90 second interview or profile. Include interests, frequency, company and one recommended new activity.

Final writing: Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.

Self-check: I can talk about habits; ask questions; understand an activity advertisement; agree on a plan.', 'Quiz, one point each:
1 She ___ yoga every morning. (do / does / goes)
2 ___ you play any sports? (Do / Does / Are)
3 How often ___ your brother go swimming? (do / does / is)
4 We ___ watch sport on TV. (don''t / doesn''t / aren''t)
5 Put in order: usually / I / in / stay / on Mondays.
6 Correct: “He doesn''t likes football.”
7 Make a question: you / interested / in music?
8 “Twice a week” means: two times each week / every two weeks.
9 Complete: I ___ photos of buildings. (take / do / play)
10 Write a follow-up question to: “I go cycling at the weekend.”

Final speaking: Record a 60–90 second interview or profile. Include interests, frequency, company and one recommended new activity.

Final writing: Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.

Self-check: I can talk about habits; ask questions; understand an activity advertisement; agree on a plan.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200050', '00000000-0000-4000-8000-000000001006', 1, 'quiz', 'Unit 1 checkpoint', 'Unit 1 checkpoint', 'Unit 1 checkpoint', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', '{"questions":[{"question":"She ___ yoga every morning.","options":["do","does","goes"],"correct":1,"explanation":"She takes does with the activity yoga.","explanation_en":"She takes does with the activity yoga."},{"question":"___ you play any sports?","options":["Do","Does","Are"],"correct":0,"explanation":"Use do with you and a main verb.","explanation_en":"Use do with you and a main verb."},{"question":"How often ___ your brother go swimming?","options":["do","does","is"],"correct":1,"explanation":"Use does with a singular third-person subject.","explanation_en":"Use does with a singular third-person subject."},{"question":"We ___ watch sport on TV.","options":["don’t","doesn’t","aren’t"],"correct":0,"explanation":"Use do not with we.","explanation_en":"Use do not with we."},{"question":"Choose the correct sentence.","options":["I usually stay in on Mondays.","I stay usually in on Mondays.","I usually stays in on Mondays."],"correct":0,"explanation":"Usually comes before the main verb.","explanation_en":"Usually comes before the main verb."},{"question":"Choose the correct negative.","options":["He doesn’t likes football.","He doesn’t like football.","He don’t like football."],"correct":1,"explanation":"After does not, use the base verb.","explanation_en":"After does not, use the base verb."},{"question":"Choose the correct question.","options":["Do you interested in music?","Are you interested in music?","Does you interested in music?"],"correct":1,"explanation":"Interested takes be.","explanation_en":"Interested takes be."},{"question":"Twice a week means …","options":["every two weeks","two times each week","every day"],"correct":1,"explanation":"Twice means two times.","explanation_en":"Twice means two times."},{"question":"I ___ photos of buildings.","options":["take","do","play"],"correct":0,"explanation":"The phrase is take photos.","explanation_en":"The phrase is take photos."},{"question":"A useful follow-up to “I go cycling” is …","options":["Where do you go cycling?","Where you cycling?","Where does you go?"],"correct":0,"explanation":"Ask for more detail with a correctly formed question.","explanation_en":"Ask for more detail with a correctly formed question."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200051', '00000000-0000-4000-8000-000000001006', 2, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.', 'Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.', 'Send a friend an 80–100 word message suggesting a free-time activity. Include when, where, why it suits them and one question.', '{"min_words":80,"max_words":100,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001007', '00000000-0000-4000-8000-000000000100', 7, '2.1 First-time feelings', '2.1 First-time feelings', '2.1 First-time feelings', 'describe a past experience and your feelings.', 'describe a past experience and your feelings.', 'describe a past experience and your feelings.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001007', '', 'Goal: describe a past experience and your feelings.

- **try something for the first time** — попробовать впервые. I tried badminton for the first time.
- **join a club** — вступить в клуб. I joined a photography club.
- **sign up for a class** — записаться на занятие. She signed up for a dance class.
- **meet someone new** — познакомиться с новым человеком. We met someone new.
- **make a mistake** — ошибиться. I made a small mistake.
- **ask for help** — попросить помощи. He asked for help.
- **feel nervous** — нервничать. I felt nervous before the lesson.
- **feel excited** — испытывать радостное волнение. She felt excited about the trip.
- **feel embarrassed** — чувствовать неловкость. I felt embarrassed about my mistake.
- **feel proud** — гордиться. We felt proud after the match.
- **feel disappointed** — чувствовать разочарование. He felt disappointed with the result.
- **give it another try** — попробовать ещё раз. I gave it another try on Sunday.

Meaning check: Choose a feeling: 1 You want to speak, but worry about mistakes. 2 You finish a difficult task successfully. 3 An activity is worse than you expected. 4 You look forward to your first trip abroad.

Personal response: “The first time I …, I felt … because …”. You can use a fictional experience if you prefer.', 'Goal: describe a past experience and your feelings.

- **try something for the first time** — попробовать впервые. I tried badminton for the first time.
- **join a club** — вступить в клуб. I joined a photography club.
- **sign up for a class** — записаться на занятие. She signed up for a dance class.
- **meet someone new** — познакомиться с новым человеком. We met someone new.
- **make a mistake** — ошибиться. I made a small mistake.
- **ask for help** — попросить помощи. He asked for help.
- **feel nervous** — нервничать. I felt nervous before the lesson.
- **feel excited** — испытывать радостное волнение. She felt excited about the trip.
- **feel embarrassed** — чувствовать неловкость. I felt embarrassed about my mistake.
- **feel proud** — гордиться. We felt proud after the match.
- **feel disappointed** — чувствовать разочарование. He felt disappointed with the result.
- **give it another try** — попробовать ещё раз. I gave it another try on Sunday.

Meaning check: Choose a feeling: 1 You want to speak, but worry about mistakes. 2 You finish a difficult task successfully. 3 An activity is worse than you expected. 4 You look forward to your first trip abroad.

Personal response: “The first time I …, I felt … because …”. You can use a fictional experience if you prefer.', 'Goal: describe a past experience and your feelings.

- **try something for the first time** — попробовать впервые. I tried badminton for the first time.
- **join a club** — вступить в клуб. I joined a photography club.
- **sign up for a class** — записаться на занятие. She signed up for a dance class.
- **meet someone new** — познакомиться с новым человеком. We met someone new.
- **make a mistake** — ошибиться. I made a small mistake.
- **ask for help** — попросить помощи. He asked for help.
- **feel nervous** — нервничать. I felt nervous before the lesson.
- **feel excited** — испытывать радостное волнение. She felt excited about the trip.
- **feel embarrassed** — чувствовать неловкость. I felt embarrassed about my mistake.
- **feel proud** — гордиться. We felt proud after the match.
- **feel disappointed** — чувствовать разочарование. He felt disappointed with the result.
- **give it another try** — попробовать ещё раз. I gave it another try on Sunday.

Meaning check: Choose a feeling: 1 You want to speak, but worry about mistakes. 2 You finish a difficult task successfully. 3 An activity is worse than you expected. 4 You look forward to your first trip abroad.

Personal response: “The first time I …, I felt … because …”. You can use a fictional experience if you prefer.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200060', '00000000-0000-4000-8000-000000001007', 1, 'vocabulary', 'Useful phrases', 'Useful phrases', 'Useful phrases', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', '{"words":[{"term":"try something for the first time","ru":"попробовать впервые","kk":"","example":"I tried badminton for the first time."},{"term":"join a club","ru":"вступить в клуб","kk":"","example":"I joined a photography club."},{"term":"sign up for a class","ru":"записаться на занятие","kk":"","example":"She signed up for a dance class."},{"term":"meet someone new","ru":"познакомиться с новым человеком","kk":"","example":"We met someone new."},{"term":"make a mistake","ru":"ошибиться","kk":"","example":"I made a small mistake."},{"term":"ask for help","ru":"попросить помощи","kk":"","example":"He asked for help."},{"term":"feel nervous","ru":"нервничать","kk":"","example":"I felt nervous before the lesson."},{"term":"feel excited","ru":"испытывать радостное волнение","kk":"","example":"She felt excited about the trip."},{"term":"feel embarrassed","ru":"чувствовать неловкость","kk":"","example":"I felt embarrassed about my mistake."},{"term":"feel proud","ru":"гордиться","kk":"","example":"We felt proud after the match."},{"term":"feel disappointed","ru":"чувствовать разочарование","kk":"","example":"He felt disappointed with the result."},{"term":"give it another try","ru":"попробовать ещё раз","kk":"","example":"I gave it another try on Sunday."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200061', '00000000-0000-4000-8000-000000001007', 2, 'pronunciation', 'Say it clearly', 'Say it clearly', 'Say it clearly', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', '{"phrases":[{"text":"I tried badminton for the first time."},{"text":"I joined a photography club."},{"text":"She signed up for a dance class."},{"text":"We met someone new."},{"text":"I made a small mistake."},{"text":"He asked for help."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200062', '00000000-0000-4000-8000-000000001007', 3, 'writing', 'Your response', 'Your response', 'Your response', 'describe a past experience and your feelings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'describe a past experience and your feelings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'describe a past experience and your feelings.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001008', '00000000-0000-4000-8000-000000000100', 8, '2.2 The day I joined', '2.2 The day I joined', '2.2 The day I joined', 'understand a short narrative and form past simple statements.', 'understand a short narrative and form past simple statements.', 'understand a short narrative and form past simple statements.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001008', '', 'Goal: understand a short narrative and form past simple statements.

Read:
> Last September, I moved to a new part of the city. I knew my neighbours, but I didn''t have any close friends nearby. One Saturday, I saw a poster for a photography walk and signed up. I felt nervous when I arrived. Everyone had a camera, and I only had my phone. The organiser smiled and said, “That''s enough!” We walked through a market and took photos of small details. I dropped my phone, but luckily it didn''t break. A woman called Sara helped me pick it up. We talked, laughed and stopped for tea after the walk. I went home with ten photos and a new friend''s number. The next week, I joined the group again.

Comprehension: 1 Why did the narrator want to meet people? 2 How did they find the activity? 3 Why did they feel nervous? 4 Did the phone break? 5 Who helped? 6 What did the narrator do the following week?

Language: Regular verbs: move → moved; sign → signed; stop → stopped; study → studied. Irregular verbs: see → saw; feel → felt; take → took; go → went; have → had. Negative: **didn''t + base verb**. Be: **was/were**, **wasn''t/weren''t**, without did.

Practice: 1 We ___ (join) a club. 2 She ___ (take) six photos. 3 I ___ (not/know) anyone. 4 They ___ (be) friendly. 5 He ___ (not/be) late. 6 Correct: “I didn''t went home early.”

Time expressions: **at** six o''clock; **on** Saturday; **in** September; two days **ago**; last week; yesterday. No “in last week”.

Write: Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.', 'Goal: understand a short narrative and form past simple statements.

Read:
> Last September, I moved to a new part of the city. I knew my neighbours, but I didn''t have any close friends nearby. One Saturday, I saw a poster for a photography walk and signed up. I felt nervous when I arrived. Everyone had a camera, and I only had my phone. The organiser smiled and said, “That''s enough!” We walked through a market and took photos of small details. I dropped my phone, but luckily it didn''t break. A woman called Sara helped me pick it up. We talked, laughed and stopped for tea after the walk. I went home with ten photos and a new friend''s number. The next week, I joined the group again.

Comprehension: 1 Why did the narrator want to meet people? 2 How did they find the activity? 3 Why did they feel nervous? 4 Did the phone break? 5 Who helped? 6 What did the narrator do the following week?

Language: Regular verbs: move → moved; sign → signed; stop → stopped; study → studied. Irregular verbs: see → saw; feel → felt; take → took; go → went; have → had. Negative: **didn''t + base verb**. Be: **was/were**, **wasn''t/weren''t**, without did.

Practice: 1 We ___ (join) a club. 2 She ___ (take) six photos. 3 I ___ (not/know) anyone. 4 They ___ (be) friendly. 5 He ___ (not/be) late. 6 Correct: “I didn''t went home early.”

Time expressions: **at** six o''clock; **on** Saturday; **in** September; two days **ago**; last week; yesterday. No “in last week”.

Write: Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.', 'Goal: understand a short narrative and form past simple statements.

Read:
> Last September, I moved to a new part of the city. I knew my neighbours, but I didn''t have any close friends nearby. One Saturday, I saw a poster for a photography walk and signed up. I felt nervous when I arrived. Everyone had a camera, and I only had my phone. The organiser smiled and said, “That''s enough!” We walked through a market and took photos of small details. I dropped my phone, but luckily it didn''t break. A woman called Sara helped me pick it up. We talked, laughed and stopped for tea after the walk. I went home with ten photos and a new friend''s number. The next week, I joined the group again.

Comprehension: 1 Why did the narrator want to meet people? 2 How did they find the activity? 3 Why did they feel nervous? 4 Did the phone break? 5 Who helped? 6 What did the narrator do the following week?

Language: Regular verbs: move → moved; sign → signed; stop → stopped; study → studied. Irregular verbs: see → saw; feel → felt; take → took; go → went; have → had. Negative: **didn''t + base verb**. Be: **was/were**, **wasn''t/weren''t**, without did.

Practice: 1 We ___ (join) a club. 2 She ___ (take) six photos. 3 I ___ (not/know) anyone. 4 They ___ (be) friendly. 5 He ___ (not/be) late. 6 Correct: “I didn''t went home early.”

Time expressions: **at** six o''clock; **on** Saturday; **in** September; two days **ago**; last week; yesterday. No “in last week”.

Write: Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200070', '00000000-0000-4000-8000-000000001008', 1, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.', 'Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.', 'Six true or fictional sentences about last weekend: two regular verbs, two irregular verbs, one negative and one sentence with was/were.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001009', '00000000-0000-4000-8000-000000000100', 9, '2.3 What happened next?', '2.3 What happened next?', '2.3 What happened next?', 'ask questions about completed events.', 'ask questions about completed events.', 'ask questions about completed events.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001009', '', 'Goal: ask questions about completed events.

Models: “When did you join?”; “Who did you meet?”; “Did you enjoy it?”; “Were you nervous?”; “Was the lesson difficult?”

Russian support: После did используйте начальную форму: “Did you go?”, не “Did you went?”. С was/were вспомогательный did не нужен.

Repair: 1 Where did you went? 2 Did she enjoyed it? 3 Did you were tired? 4 When you arrived?

Build: 5 who / you / meet? 6 the people / friendly / be? 7 what / you / do / after the class?

Pronunciation mini-lab: Regular -ed endings have three common pronunciations: /t/ in **walked**, /d/ in **played**, /ɪd/ in **wanted**. The extra syllable is used after /t/ or /d/. Sort: watched, visited, enjoyed, needed, helped, arrived.

Task: Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.', 'Goal: ask questions about completed events.

Models: “When did you join?”; “Who did you meet?”; “Did you enjoy it?”; “Were you nervous?”; “Was the lesson difficult?”

Russian support: После did используйте начальную форму: “Did you go?”, не “Did you went?”. С was/were вспомогательный did не нужен.

Repair: 1 Where did you went? 2 Did she enjoyed it? 3 Did you were tired? 4 When you arrived?

Build: 5 who / you / meet? 6 the people / friendly / be? 7 what / you / do / after the class?

Pronunciation mini-lab: Regular -ed endings have three common pronunciations: /t/ in **walked**, /d/ in **played**, /ɪd/ in **wanted**. The extra syllable is used after /t/ or /d/. Sort: watched, visited, enjoyed, needed, helped, arrived.

Task: Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.', 'Goal: ask questions about completed events.

Models: “When did you join?”; “Who did you meet?”; “Did you enjoy it?”; “Were you nervous?”; “Was the lesson difficult?”

Russian support: После did используйте начальную форму: “Did you go?”, не “Did you went?”. С was/were вспомогательный did не нужен.

Repair: 1 Where did you went? 2 Did she enjoyed it? 3 Did you were tired? 4 When you arrived?

Build: 5 who / you / meet? 6 the people / friendly / be? 7 what / you / do / after the class?

Pronunciation mini-lab: Regular -ed endings have three common pronunciations: /t/ in **walked**, /d/ in **played**, /ɪd/ in **wanted**. The extra syllable is used after /t/ or /d/. Sort: watched, visited, enjoyed, needed, helped, arrived.

Task: Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200080', '00000000-0000-4000-8000-000000001009', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Interview a partner about the last time they tried something new. Ask at least five questions; include one question with was/were and one follow-up question. Solo option: make an interview with two voices.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001010', '00000000-0000-4000-8000-000000000100', 10, '2.4 My first evening class', '2.4 My first evening class', '2.4 My first evening class', 'understand the order of events and changes in feelings.', 'understand the order of events and changes in feelings.', 'understand the order of events and changes in feelings.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001010', '', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand the order of events and changes in feelings.

First reading: Was the experience positive overall?
Second reading: 1 What class did Lena attend? 2 Why did she arrive late? 3 What mistake did she make? 4 How did the teacher respond? 5 How did she feel at the end?

Recording script:
> Last month, I went to my first evening cooking class. I left home early, but I took the wrong bus and arrived ten minutes late. I felt embarrassed. The teacher showed me a place next to a student called Timur. We made vegetable soup. I didn''t read the recipe carefully and added too much salt. I wanted to start again, but the teacher said, “Let''s see what we can do.” She added more water and vegetables. The soup tasted good in the end! After the class, Timur and I cleaned the table and talked about our favourite food. I went home feeling proud. I made a mistake, but I also made a friend.

Order: A The teacher improved the soup. B Lena took the wrong bus. C Lena talked with Timur. D Lena added too much salt.

Speaking: Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand the order of events and changes in feelings.

First reading: Was the experience positive overall?
Second reading: 1 What class did Lena attend? 2 Why did she arrive late? 3 What mistake did she make? 4 How did the teacher respond? 5 How did she feel at the end?

Recording script:
> Last month, I went to my first evening cooking class. I left home early, but I took the wrong bus and arrived ten minutes late. I felt embarrassed. The teacher showed me a place next to a student called Timur. We made vegetable soup. I didn''t read the recipe carefully and added too much salt. I wanted to start again, but the teacher said, “Let''s see what we can do.” She added more water and vegetables. The soup tasted good in the end! After the class, Timur and I cleaned the table and talked about our favourite food. I went home feeling proud. I made a mistake, but I also made a friend.

Order: A The teacher improved the soup. B Lena took the wrong bus. C Lena talked with Timur. D Lena added too much salt.

Speaking: Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand the order of events and changes in feelings.

First reading: Was the experience positive overall?
Second reading: 1 What class did Lena attend? 2 Why did she arrive late? 3 What mistake did she make? 4 How did the teacher respond? 5 How did she feel at the end?

Recording script:
> Last month, I went to my first evening cooking class. I left home early, but I took the wrong bus and arrived ten minutes late. I felt embarrassed. The teacher showed me a place next to a student called Timur. We made vegetable soup. I didn''t read the recipe carefully and added too much salt. I wanted to start again, but the teacher said, “Let''s see what we can do.” She added more water and vegetables. The soup tasted good in the end! After the class, Timur and I cleaned the table and talked about our favourite food. I went home feeling proud. I made a mistake, but I also made a friend.

Order: A The teacher improved the soup. B Lena took the wrong bus. C Lena talked with Timur. D Lena added too much salt.

Speaking: Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200090', '00000000-0000-4000-8000-000000001010', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Retell the story in five sentences using first, then, after that and finally. Do not add events that are absent from the recording.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001011', '00000000-0000-4000-8000-000000000100', 11, '2.5 Tell a story people can follow', '2.5 Tell a story people can follow', '2.5 Tell a story people can follow', 'connect events and give a reason.', 'connect events and give a reason.', 'connect events and give a reason.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001011', '', 'Goal: connect events and give a reason.

Story frame:
1 Setting: When? Where? Who?
2 Events: What happened first? What happened next?
3 Result: How did it end? How did you feel?

Connectors: **and** adds information; **but** contrasts; **because** gives a reason; **so** gives a result; **then/after that/finally** order events.

Choose: 1 I felt nervous ___ I didn''t know anyone. 2 I missed the bus, ___ I walked. 3 The game was difficult, ___ I enjoyed it. 4 We finished the class. ___, we went for tea.

Model:
> Two weeks ago, I joined a board-game evening at a café. I went alone because my friend was busy. At first, I felt nervous, but the organiser introduced me to three people. We played a new game, and I made several mistakes. Everyone helped me. After that, we ordered tea and talked about our weekends. I didn''t win, but I enjoyed the evening. Finally, we exchanged numbers and agreed to meet again. I felt happy because I tried something new.

Writing: Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.', 'Goal: connect events and give a reason.

Story frame:
1 Setting: When? Where? Who?
2 Events: What happened first? What happened next?
3 Result: How did it end? How did you feel?

Connectors: **and** adds information; **but** contrasts; **because** gives a reason; **so** gives a result; **then/after that/finally** order events.

Choose: 1 I felt nervous ___ I didn''t know anyone. 2 I missed the bus, ___ I walked. 3 The game was difficult, ___ I enjoyed it. 4 We finished the class. ___, we went for tea.

Model:
> Two weeks ago, I joined a board-game evening at a café. I went alone because my friend was busy. At first, I felt nervous, but the organiser introduced me to three people. We played a new game, and I made several mistakes. Everyone helped me. After that, we ordered tea and talked about our weekends. I didn''t win, but I enjoyed the evening. Finally, we exchanged numbers and agreed to meet again. I felt happy because I tried something new.

Writing: Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.', 'Goal: connect events and give a reason.

Story frame:
1 Setting: When? Where? Who?
2 Events: What happened first? What happened next?
3 Result: How did it end? How did you feel?

Connectors: **and** adds information; **but** contrasts; **because** gives a reason; **so** gives a result; **then/after that/finally** order events.

Choose: 1 I felt nervous ___ I didn''t know anyone. 2 I missed the bus, ___ I walked. 3 The game was difficult, ___ I enjoyed it. 4 We finished the class. ___, we went for tea.

Model:
> Two weeks ago, I joined a board-game evening at a café. I went alone because my friend was busy. At first, I felt nervous, but the organiser introduced me to three people. We played a new game, and I made several mistakes. Everyone helped me. After that, we ordered tea and talked about our weekends. I didn''t win, but I enjoyed the evening. Finally, we exchanged numbers and agreed to meet again. I felt happy because I tried something new.

Writing: Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200100', '00000000-0000-4000-8000-000000001011', 1, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.', 'Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.', 'Write 80–100 words about a first or last experience. Include a time expression, the setting, four events, a negative sentence, feelings and three connectors. Revise verbs before submitting.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001012', '00000000-0000-4000-8000-000000000100', 12, '2.6 Firsts and lasts: checkpoint', '2.6 Firsts and lasts: checkpoint', '2.6 Firsts and lasts: checkpoint', 'Unit 2 checkpoint and project.', 'Unit 2 checkpoint and project.', 'Unit 2 checkpoint and project.', 40, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001012', '', 'Quiz, one point each:
1 Yesterday I ___ a new club. (join / joined / joining)
2 We ___ home early. (didn''t went / didn''t go / don''t went)
3 ___ you enjoy the class? (Did / Were / Do)
4 She ___ nervous before the lesson. (were / was / did)
5 Correct: “Did he took the bus?”
6 Complete: I met Sara ___ September. (at / on / in)
7 Complete: We played football two days ___.
8 Past simple of feel: ___.
9 Which -ed ending adds a syllable? (walked / played / wanted)
10 Join with because: “I stayed at home. I felt tired.”

Final speaking: Record a 60–90 second first/last experience story. Use at least five past simple verbs, including a negative. Explain a feeling and give a clear ending.

Final writing: Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.

Self-check: I can describe completed events; ask past questions; explain feelings; connect a short story.', 'Quiz, one point each:
1 Yesterday I ___ a new club. (join / joined / joining)
2 We ___ home early. (didn''t went / didn''t go / don''t went)
3 ___ you enjoy the class? (Did / Were / Do)
4 She ___ nervous before the lesson. (were / was / did)
5 Correct: “Did he took the bus?”
6 Complete: I met Sara ___ September. (at / on / in)
7 Complete: We played football two days ___.
8 Past simple of feel: ___.
9 Which -ed ending adds a syllable? (walked / played / wanted)
10 Join with because: “I stayed at home. I felt tired.”

Final speaking: Record a 60–90 second first/last experience story. Use at least five past simple verbs, including a negative. Explain a feeling and give a clear ending.

Final writing: Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.

Self-check: I can describe completed events; ask past questions; explain feelings; connect a short story.', 'Quiz, one point each:
1 Yesterday I ___ a new club. (join / joined / joining)
2 We ___ home early. (didn''t went / didn''t go / don''t went)
3 ___ you enjoy the class? (Did / Were / Do)
4 She ___ nervous before the lesson. (were / was / did)
5 Correct: “Did he took the bus?”
6 Complete: I met Sara ___ September. (at / on / in)
7 Complete: We played football two days ___.
8 Past simple of feel: ___.
9 Which -ed ending adds a syllable? (walked / played / wanted)
10 Join with because: “I stayed at home. I felt tired.”

Final speaking: Record a 60–90 second first/last experience story. Use at least five past simple verbs, including a negative. Explain a feeling and give a clear ending.

Final writing: Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.

Self-check: I can describe completed events; ask past questions; explain feelings; connect a short story.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200110', '00000000-0000-4000-8000-000000001012', 1, 'quiz', 'Unit 2 checkpoint', 'Unit 2 checkpoint', 'Unit 2 checkpoint', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', '{"questions":[{"question":"Yesterday I ___ a new club.","options":["join","joined","joining"],"correct":1,"explanation":"Yesterday signals a completed past event.","explanation_en":"Yesterday signals a completed past event."},{"question":"We ___ home early.","options":["didn’t went","didn’t go","don’t went"],"correct":1,"explanation":"Use the base form after did not.","explanation_en":"Use the base form after did not."},{"question":"___ you enjoy the class?","options":["Did","Were","Does"],"correct":0,"explanation":"Use did for past questions with enjoy.","explanation_en":"Use did for past questions with enjoy."},{"question":"She ___ nervous before the lesson.","options":["were","was","did"],"correct":1,"explanation":"Use was with she.","explanation_en":"Use was with she."},{"question":"Choose the correct question.","options":["Did he took the bus?","Did he take the bus?","Does he took the bus?"],"correct":1,"explanation":"Use take after did.","explanation_en":"Use take after did."},{"question":"I met Sara ___ September.","options":["at","on","in"],"correct":2,"explanation":"Use in with months.","explanation_en":"Use in with months."},{"question":"We played football two days ___.","options":["last","ago","yesterday"],"correct":1,"explanation":"Ago follows the time period.","explanation_en":"Ago follows the time period."},{"question":"The past simple of feel is …","options":["feeled","felt","fallen"],"correct":1,"explanation":"Feel is irregular: felt.","explanation_en":"Feel is irregular: felt."},{"question":"Which ending adds a syllable?","options":["walked","played","wanted"],"correct":2,"explanation":"After /t/, -ed is pronounced /ɪd/.","explanation_en":"After /t/, -ed is pronounced /ɪd/."},{"question":"Choose the sentence giving a reason.","options":["I stayed home because I felt tired.","I stayed home but I felt tired.","I stayed home then I felt tired."],"correct":0,"explanation":"Because introduces the reason.","explanation_en":"Because introduces the reason."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200111', '00000000-0000-4000-8000-000000001012', 2, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.', 'Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.', 'Revise the 80–100 word story from 2.5 after feedback. Submit the original and revised versions together.', '{"min_words":80,"max_words":100,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001013', '00000000-0000-4000-8000-000000000100', 13, '3.1 How do you spend your day?', '3.1 How do you spend your day?', '3.1 How do you spend your day?', 'describe work, study and rest with useful phrases.', 'describe work, study and rest with useful phrases.', 'describe work, study and rest with useful phrases.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001013', '', 'Goal: describe work, study and rest with useful phrases.

- **wake up** — просыпаться. I wake up at seven.
- **get ready** — собираться. I get ready in twenty minutes.
- **commute to work** — ездить на работу. She commutes to work by bus.
- **start a shift** — начинать смену. He starts a shift at eight.
- **finish work** — заканчивать работу. We finish work at six.
- **take a break** — делать перерыв. I take a break at eleven.
- **work from home** — работать из дома. She works from home on Mondays.
- **deal with customers** — работать с клиентами. I deal with customers every day.
- **work outdoors** — работать на открытом воздухе. They work outdoors.
- **work in a team** — работать в команде. We work in a small team.
- **have a day off** — иметь выходной. I have a day off on Tuesday.
- **get enough sleep** — высыпаться. I try to get enough sleep.

Jobs: receptionist, shop assistant, delivery driver, gardener, office assistant, fitness instructor. Gender does not determine suitability for any job.

Match: 1 welcomes hotel guests; 2 helps shoppers; 3 delivers parcels; 4 looks after plants; 5 leads exercise classes; 6 organizes office documents.

Task: Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.', 'Goal: describe work, study and rest with useful phrases.

- **wake up** — просыпаться. I wake up at seven.
- **get ready** — собираться. I get ready in twenty minutes.
- **commute to work** — ездить на работу. She commutes to work by bus.
- **start a shift** — начинать смену. He starts a shift at eight.
- **finish work** — заканчивать работу. We finish work at six.
- **take a break** — делать перерыв. I take a break at eleven.
- **work from home** — работать из дома. She works from home on Mondays.
- **deal with customers** — работать с клиентами. I deal with customers every day.
- **work outdoors** — работать на открытом воздухе. They work outdoors.
- **work in a team** — работать в команде. We work in a small team.
- **have a day off** — иметь выходной. I have a day off on Tuesday.
- **get enough sleep** — высыпаться. I try to get enough sleep.

Jobs: receptionist, shop assistant, delivery driver, gardener, office assistant, fitness instructor. Gender does not determine suitability for any job.

Match: 1 welcomes hotel guests; 2 helps shoppers; 3 delivers parcels; 4 looks after plants; 5 leads exercise classes; 6 organizes office documents.

Task: Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.', 'Goal: describe work, study and rest with useful phrases.

- **wake up** — просыпаться. I wake up at seven.
- **get ready** — собираться. I get ready in twenty minutes.
- **commute to work** — ездить на работу. She commutes to work by bus.
- **start a shift** — начинать смену. He starts a shift at eight.
- **finish work** — заканчивать работу. We finish work at six.
- **take a break** — делать перерыв. I take a break at eleven.
- **work from home** — работать из дома. She works from home on Mondays.
- **deal with customers** — работать с клиентами. I deal with customers every day.
- **work outdoors** — работать на открытом воздухе. They work outdoors.
- **work in a team** — работать в команде. We work in a small team.
- **have a day off** — иметь выходной. I have a day off on Tuesday.
- **get enough sleep** — высыпаться. I try to get enough sleep.

Jobs: receptionist, shop assistant, delivery driver, gardener, office assistant, fitness instructor. Gender does not determine suitability for any job.

Match: 1 welcomes hotel guests; 2 helps shoppers; 3 delivers parcels; 4 looks after plants; 5 leads exercise classes; 6 organizes office documents.

Task: Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200120', '00000000-0000-4000-8000-000000001013', 1, 'vocabulary', 'Useful phrases', 'Useful phrases', 'Useful phrases', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', 'Recall the phrase, check its meaning and say your own example.', '{"words":[{"term":"wake up","ru":"просыпаться","kk":"","example":"I wake up at seven."},{"term":"get ready","ru":"собираться","kk":"","example":"I get ready in twenty minutes."},{"term":"commute to work","ru":"ездить на работу","kk":"","example":"She commutes to work by bus."},{"term":"start a shift","ru":"начинать смену","kk":"","example":"He starts a shift at eight."},{"term":"finish work","ru":"заканчивать работу","kk":"","example":"We finish work at six."},{"term":"take a break","ru":"делать перерыв","kk":"","example":"I take a break at eleven."},{"term":"work from home","ru":"работать из дома","kk":"","example":"She works from home on Mondays."},{"term":"deal with customers","ru":"работать с клиентами","kk":"","example":"I deal with customers every day."},{"term":"work outdoors","ru":"работать на открытом воздухе","kk":"","example":"They work outdoors."},{"term":"work in a team","ru":"работать в команде","kk":"","example":"We work in a small team."},{"term":"have a day off","ru":"иметь выходной","kk":"","example":"I have a day off on Tuesday."},{"term":"get enough sleep","ru":"высыпаться","kk":"","example":"I try to get enough sleep."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200121', '00000000-0000-4000-8000-000000001013', 2, 'pronunciation', 'Say it clearly', 'Say it clearly', 'Say it clearly', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', 'Listen to each example, repeat it, then record yourself.', '{"phrases":[{"text":"I wake up at seven."},{"text":"I get ready in twenty minutes."},{"text":"She commutes to work by bus."},{"text":"He starts a shift at eight."},{"text":"We finish work at six."},{"text":"I take a break at eleven."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200122', '00000000-0000-4000-8000-000000001013', 3, 'writing', 'Your response', 'Your response', 'Your response', 'Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Describe a typical day in six sentences. You can describe a fictional worker if you are not employed. Include a break and time to rest.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001014', '00000000-0000-4000-8000-000000000100', 14, '3.2 A routine that needs a change', '3.2 A routine that needs a change', '3.2 A routine that needs a change', 'understand a routine and give everyday suggestions with should/shouldn''t.', 'understand a routine and give everyday suggestions with should/shouldn''t.', 'understand a routine and give everyday suggestions with should/shouldn''t.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001014', '', 'Goal: understand a routine and give everyday suggestions with should/shouldn''t.

Read:
> Arman studies in the morning and works in a café three evenings a week. He usually finishes at nine. When he gets home, he checks messages, watches videos and sometimes studies until late. He often forgets to prepare his bag, so mornings feel rushed. His friend suggests one small change: prepare the bag before dinner. Arman tries it for a week. He still has busy days, but he spends less time looking for his books. On his day off, he meets a friend for a short walk. He says the best change is having a simple plan he can follow.

Check: 1 How often does he work? 2 What makes mornings rushed? 3 What change does he try? 4 Does the text say all his problems disappear?

Language: **should + base verb** for advice: “You should prepare your bag.” **shouldn''t + base verb**: “You shouldn''t leave everything until the last minute.” Question: “What should I do?” Advice is different from a rule.

Practice: 1 I''m always late for the bus. → Give a practical suggestion. 2 My desk is difficult to use. → Give a suggestion. 3 Correct: “You should to make a plan.” 4 Correct: “He shouldn''t checks messages during class.”

Speaking: Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.', 'Goal: understand a routine and give everyday suggestions with should/shouldn''t.

Read:
> Arman studies in the morning and works in a café three evenings a week. He usually finishes at nine. When he gets home, he checks messages, watches videos and sometimes studies until late. He often forgets to prepare his bag, so mornings feel rushed. His friend suggests one small change: prepare the bag before dinner. Arman tries it for a week. He still has busy days, but he spends less time looking for his books. On his day off, he meets a friend for a short walk. He says the best change is having a simple plan he can follow.

Check: 1 How often does he work? 2 What makes mornings rushed? 3 What change does he try? 4 Does the text say all his problems disappear?

Language: **should + base verb** for advice: “You should prepare your bag.” **shouldn''t + base verb**: “You shouldn''t leave everything until the last minute.” Question: “What should I do?” Advice is different from a rule.

Practice: 1 I''m always late for the bus. → Give a practical suggestion. 2 My desk is difficult to use. → Give a suggestion. 3 Correct: “You should to make a plan.” 4 Correct: “He shouldn''t checks messages during class.”

Speaking: Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.', 'Goal: understand a routine and give everyday suggestions with should/shouldn''t.

Read:
> Arman studies in the morning and works in a café three evenings a week. He usually finishes at nine. When he gets home, he checks messages, watches videos and sometimes studies until late. He often forgets to prepare his bag, so mornings feel rushed. His friend suggests one small change: prepare the bag before dinner. Arman tries it for a week. He still has busy days, but he spends less time looking for his books. On his day off, he meets a friend for a short walk. He says the best change is having a simple plan he can follow.

Check: 1 How often does he work? 2 What makes mornings rushed? 3 What change does he try? 4 Does the text say all his problems disappear?

Language: **should + base verb** for advice: “You should prepare your bag.” **shouldn''t + base verb**: “You shouldn''t leave everything until the last minute.” Question: “What should I do?” Advice is different from a rule.

Practice: 1 I''m always late for the bus. → Give a practical suggestion. 2 My desk is difficult to use. → Give a suggestion. 3 Correct: “You should to make a plan.” 4 Correct: “He shouldn''t checks messages during class.”

Speaking: Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200130', '00000000-0000-4000-8000-000000001014', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Give Arman two suggestions. Explain each with because. Avoid medical diagnoses; this lesson is about ordinary routines and time management.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001015', '00000000-0000-4000-8000-000000000100', 15, '3.3 Ability, permission and responsibility', '3.3 Ability, permission and responsibility', '3.3 Ability, permission and responsibility', 'distinguish can/can''t from have to/don''t have to.', 'distinguish can/can''t from have to/don''t have to.', 'distinguish can/can''t from have to/don''t have to.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001015', '', 'Goal: distinguish can/can''t from have to/don''t have to.

Examples:
- Ability: “I **can** use spreadsheets.” / “I **can''t** drive.”
- Permission: “You **can** use this room for your break.”
- A rule refusing permission: “You **can''t** park here.”
- Requirement: “We **have to** arrive before nine.” / “She **has to** wear a uniform.”
- No requirement: “You **don''t have to** work on Sundays.” It is optional, not forbidden.
- Question: “**Does** she **have to** work on Sundays?”

Russian support: **don''t have to** = «не обязательно», а не «нельзя». Сравните: “You don''t have to wear a uniform” и “You can''t wear outdoor shoes here.”

Choose:
1 The employer provides lunch. You ___ bring food, but you can. (don''t have to / can''t)
2 A driving licence is required. Drivers ___ have one. (have to / don''t have to)
3 Photography is forbidden in this room. You ___ take photos. (can''t / don''t have to)
4 Sara knows how to repair bikes. She ___ repair them. (can / has to)
5 He ___ wear a uniform. (have to / has to)
6 ___ you have to start early? (Do / Can)

Task: Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.', 'Goal: distinguish can/can''t from have to/don''t have to.

Examples:
- Ability: “I **can** use spreadsheets.” / “I **can''t** drive.”
- Permission: “You **can** use this room for your break.”
- A rule refusing permission: “You **can''t** park here.”
- Requirement: “We **have to** arrive before nine.” / “She **has to** wear a uniform.”
- No requirement: “You **don''t have to** work on Sundays.” It is optional, not forbidden.
- Question: “**Does** she **have to** work on Sundays?”

Russian support: **don''t have to** = «не обязательно», а не «нельзя». Сравните: “You don''t have to wear a uniform” и “You can''t wear outdoor shoes here.”

Choose:
1 The employer provides lunch. You ___ bring food, but you can. (don''t have to / can''t)
2 A driving licence is required. Drivers ___ have one. (have to / don''t have to)
3 Photography is forbidden in this room. You ___ take photos. (can''t / don''t have to)
4 Sara knows how to repair bikes. She ___ repair them. (can / has to)
5 He ___ wear a uniform. (have to / has to)
6 ___ you have to start early? (Do / Can)

Task: Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.', 'Goal: distinguish can/can''t from have to/don''t have to.

Examples:
- Ability: “I **can** use spreadsheets.” / “I **can''t** drive.”
- Permission: “You **can** use this room for your break.”
- A rule refusing permission: “You **can''t** park here.”
- Requirement: “We **have to** arrive before nine.” / “She **has to** wear a uniform.”
- No requirement: “You **don''t have to** work on Sundays.” It is optional, not forbidden.
- Question: “**Does** she **have to** work on Sundays?”

Russian support: **don''t have to** = «не обязательно», а не «нельзя». Сравните: “You don''t have to wear a uniform” и “You can''t wear outdoor shoes here.”

Choose:
1 The employer provides lunch. You ___ bring food, but you can. (don''t have to / can''t)
2 A driving licence is required. Drivers ___ have one. (have to / don''t have to)
3 Photography is forbidden in this room. You ___ take photos. (can''t / don''t have to)
4 Sara knows how to repair bikes. She ___ repair them. (can / has to)
5 He ___ wear a uniform. (have to / has to)
6 ___ you have to start early? (Do / Can)

Task: Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200140', '00000000-0000-4000-8000-000000001015', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Make a fictional workplace guide with two requirements, two permissions, one prohibition and one optional action. Label the intended meaning of each sentence.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001016', '00000000-0000-4000-8000-000000000100', 16, '3.4 Which job fits?', '3.4 Which job fits?', '3.4 Which job fits?', 'compare advertisements with a candidate''s abilities and availability.', 'compare advertisements with a candidate''s abilities and availability.', 'compare advertisements with a candidate''s abilities and availability.', 35, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001016', '', 'Goal: compare advertisements with a candidate''s abilities and availability.

Read these fictional advertisements:
> **A · Library event assistant.** Saturday, 10 a.m.–4 p.m. Welcome visitors and help with children''s activities. You have to speak English and work in a team. You don''t have to drive. We provide training. Indoor work.
>
> **B · Cycle delivery assistant.** Monday to Friday, 5–9 p.m. You have to ride a bicycle confidently and use a map app. You work outdoors. You don''t have to have previous delivery experience. We provide a bicycle and safety equipment.
>
> **C · Sports-centre receptionist.** Monday to Friday, 8 a.m.–noon. You have to use a computer, speak English and answer customers'' questions. You don''t have to teach sports classes. Indoor work.

Candidates:
- **Nina:** studies every weekday morning; speaks English; uses computers confidently; cannot ride a bicycle; is free on Saturdays.
- **Bek:** is free on weekday evenings; cycles confidently; can use map apps; likes outdoor work.
- **Sam:** is free on weekday mornings; speaks English; uses computers; prefers indoor work.

Match each person with the best job. Give two reasons. Then answer: 1 Which job offers training explicitly? 2 Which provides transport? 3 Does the receptionist have to teach classes? 4 Can Nina take Job B on the stated information?

Task: Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.', 'Goal: compare advertisements with a candidate''s abilities and availability.

Read these fictional advertisements:
> **A · Library event assistant.** Saturday, 10 a.m.–4 p.m. Welcome visitors and help with children''s activities. You have to speak English and work in a team. You don''t have to drive. We provide training. Indoor work.
>
> **B · Cycle delivery assistant.** Monday to Friday, 5–9 p.m. You have to ride a bicycle confidently and use a map app. You work outdoors. You don''t have to have previous delivery experience. We provide a bicycle and safety equipment.
>
> **C · Sports-centre receptionist.** Monday to Friday, 8 a.m.–noon. You have to use a computer, speak English and answer customers'' questions. You don''t have to teach sports classes. Indoor work.

Candidates:
- **Nina:** studies every weekday morning; speaks English; uses computers confidently; cannot ride a bicycle; is free on Saturdays.
- **Bek:** is free on weekday evenings; cycles confidently; can use map apps; likes outdoor work.
- **Sam:** is free on weekday mornings; speaks English; uses computers; prefers indoor work.

Match each person with the best job. Give two reasons. Then answer: 1 Which job offers training explicitly? 2 Which provides transport? 3 Does the receptionist have to teach classes? 4 Can Nina take Job B on the stated information?

Task: Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.', 'Goal: compare advertisements with a candidate''s abilities and availability.

Read these fictional advertisements:
> **A · Library event assistant.** Saturday, 10 a.m.–4 p.m. Welcome visitors and help with children''s activities. You have to speak English and work in a team. You don''t have to drive. We provide training. Indoor work.
>
> **B · Cycle delivery assistant.** Monday to Friday, 5–9 p.m. You have to ride a bicycle confidently and use a map app. You work outdoors. You don''t have to have previous delivery experience. We provide a bicycle and safety equipment.
>
> **C · Sports-centre receptionist.** Monday to Friday, 8 a.m.–noon. You have to use a computer, speak English and answer customers'' questions. You don''t have to teach sports classes. Indoor work.

Candidates:
- **Nina:** studies every weekday morning; speaks English; uses computers confidently; cannot ride a bicycle; is free on Saturdays.
- **Bek:** is free on weekday evenings; cycles confidently; can use map apps; likes outdoor work.
- **Sam:** is free on weekday mornings; speaks English; uses computers; prefers indoor work.

Match each person with the best job. Give two reasons. Then answer: 1 Which job offers training explicitly? 2 Which provides transport? 3 Does the receptionist have to teach classes? 4 Can Nina take Job B on the stated information?

Task: Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200150', '00000000-0000-4000-8000-000000001016', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Choose a job for yourself or an invented candidate. Explain suitability and one possible difficulty. Base your answer on stated information rather than assumptions about pay or personality.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001017', '00000000-0000-4000-8000-000000000100', 17, '3.5 A short job interview', '3.5 A short job interview', '3.5 A short job interview', 'understand requirements and ask for clarification.', 'understand requirements and ask for clarification.', 'understand requirements and ask for clarification.', 30, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001017', '', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand requirements and ask for clarification.

First reading: Which position is discussed?
Second reading: 1 When does the work begin? 2 What time must staff arrive? 3 Is previous experience required? 4 What clothing is required? 5 Can staff use their phones at the welcome desk?

Recording script:
> **Manager:** Thanks for coming, Nina. Why are you interested in the library event assistant job?
> **Nina:** I like helping people, and I''m free on Saturdays.
> **Manager:** Great. Can you speak English with visitors?
> **Nina:** Yes, I can. Do I have to have experience with events?
> **Manager:** No, you don''t. We provide training. The event begins at ten, but staff have to arrive at half past nine.
> **Nina:** Sorry, did you say half past nine?
> **Manager:** That''s right. You have to wear comfortable shoes. You can wear your own clothes; we give you a name badge.
> **Nina:** Can I use my phone during the event?
> **Manager:** You can use it during breaks, but you can''t use it at the welcome desk.
> **Nina:** I understand. Thank you.

Useful clarification: “Could you repeat that, please?”; “Did you say …?”; “What does … mean?” Teach as functional phrases.

Pronunciation: Contrast “I CAN help” when confirming ability with unstressed can in “I can HELP.” Practise clear negatives in can/can''t; pronunciation varies across accents, so use context and clarification too.

Role-play: Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand requirements and ask for clarification.

First reading: Which position is discussed?
Second reading: 1 When does the work begin? 2 What time must staff arrive? 3 Is previous experience required? 4 What clothing is required? 5 Can staff use their phones at the welcome desk?

Recording script:
> **Manager:** Thanks for coming, Nina. Why are you interested in the library event assistant job?
> **Nina:** I like helping people, and I''m free on Saturdays.
> **Manager:** Great. Can you speak English with visitors?
> **Nina:** Yes, I can. Do I have to have experience with events?
> **Manager:** No, you don''t. We provide training. The event begins at ten, but staff have to arrive at half past nine.
> **Nina:** Sorry, did you say half past nine?
> **Manager:** That''s right. You have to wear comfortable shoes. You can wear your own clothes; we give you a name badge.
> **Nina:** Can I use my phone during the event?
> **Manager:** You can use it during breaks, but you can''t use it at the welcome desk.
> **Nina:** I understand. Thank you.

Useful clarification: “Could you repeat that, please?”; “Did you say …?”; “What does … mean?” Teach as functional phrases.

Pronunciation: Contrast “I CAN help” when confirming ability with unstressed can in “I can HELP.” Practise clear negatives in can/can''t; pronunciation varies across accents, so use context and clarification too.

Role-play: Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.', '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.

Goal: understand requirements and ask for clarification.

First reading: Which position is discussed?
Second reading: 1 When does the work begin? 2 What time must staff arrive? 3 Is previous experience required? 4 What clothing is required? 5 Can staff use their phones at the welcome desk?

Recording script:
> **Manager:** Thanks for coming, Nina. Why are you interested in the library event assistant job?
> **Nina:** I like helping people, and I''m free on Saturdays.
> **Manager:** Great. Can you speak English with visitors?
> **Nina:** Yes, I can. Do I have to have experience with events?
> **Manager:** No, you don''t. We provide training. The event begins at ten, but staff have to arrive at half past nine.
> **Nina:** Sorry, did you say half past nine?
> **Manager:** That''s right. You have to wear comfortable shoes. You can wear your own clothes; we give you a name badge.
> **Nina:** Can I use my phone during the event?
> **Manager:** You can use it during breaks, but you can''t use it at the welcome desk.
> **Nina:** I understand. Thank you.

Useful clarification: “Could you repeat that, please?”; “Did you say …?”; “What does … mean?” Teach as functional phrases.

Pronunciation: Contrast “I CAN help” when confirming ability with unstressed can in “I can HELP.” Practise clear negatives in can/can''t; pronunciation varies across accents, so use context and clarification too.

Role-play: Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200160', '00000000-0000-4000-8000-000000001017', 1, 'writing', 'Your response', 'Your response', 'Your response', 'Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', 'Conduct a one-minute interview for a fictional job. Include ability, a requirement, something optional and one clarification question.
Write your response or the script for your conversation. Complete the speaking activity aloud as well.', '{"min_words":30,"max_words":120,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.lessons (id, course_id, sort, title, title_kk, title_en, summary, summary_kk, summary_en, minutes, is_free, is_published) values ('00000000-0000-4000-8000-000000001018', '00000000-0000-4000-8000-000000000100', 18, '3.6 A better balance', '3.6 A better balance', '3.6 A better balance', 'Unit 3 checkpoint and project.', 'Unit 3 checkpoint and project.', 'Unit 3 checkpoint and project.', 40, false, true) on conflict (id) do update set course_id = excluded.course_id, sort = excluded.sort, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, summary = excluded.summary, summary_kk = excluded.summary_kk, summary_en = excluded.summary_en, minutes = excluded.minutes, is_free = excluded.is_free, is_published = excluded.is_published;
insert into public.lesson_materials (lesson_id, video_url, body, body_kk, body_en) values ('00000000-0000-4000-8000-000000001018', '', 'Quiz, one point each:
1 You ___ prepare your bag earlier. (should / should to)
2 She ___ wear a badge at work. (have to / has to)
3 The course is optional. You ___. (don''t have to attend / can''t attend)
4 Mobile phones are forbidden here. You ___. (can''t use one / don''t have to use one)
5 ___ he have to work on Saturdays? (Does / Has)
6 Correct: “I can to use a computer.”
7 Correct: “You shouldn''t works during your break.”
8 Name the job: a person who welcomes hotel guests.
9 Complete: I usually ___ a break at eleven.
10 Write one piece of advice for a student who forgets homework deadlines.

Final speaking: Recommend one of the jobs from 3.4 for a candidate. Speak for 60–90 seconds. Include two abilities, two requirements, one optional action and a reason for your choice.

Final writing: Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.

Self-check: I can explain a routine; give advice; distinguish optional actions from prohibitions; discuss job requirements.', 'Quiz, one point each:
1 You ___ prepare your bag earlier. (should / should to)
2 She ___ wear a badge at work. (have to / has to)
3 The course is optional. You ___. (don''t have to attend / can''t attend)
4 Mobile phones are forbidden here. You ___. (can''t use one / don''t have to use one)
5 ___ he have to work on Saturdays? (Does / Has)
6 Correct: “I can to use a computer.”
7 Correct: “You shouldn''t works during your break.”
8 Name the job: a person who welcomes hotel guests.
9 Complete: I usually ___ a break at eleven.
10 Write one piece of advice for a student who forgets homework deadlines.

Final speaking: Recommend one of the jobs from 3.4 for a candidate. Speak for 60–90 seconds. Include two abilities, two requirements, one optional action and a reason for your choice.

Final writing: Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.

Self-check: I can explain a routine; give advice; distinguish optional actions from prohibitions; discuss job requirements.', 'Quiz, one point each:
1 You ___ prepare your bag earlier. (should / should to)
2 She ___ wear a badge at work. (have to / has to)
3 The course is optional. You ___. (don''t have to attend / can''t attend)
4 Mobile phones are forbidden here. You ___. (can''t use one / don''t have to use one)
5 ___ he have to work on Saturdays? (Does / Has)
6 Correct: “I can to use a computer.”
7 Correct: “You shouldn''t works during your break.”
8 Name the job: a person who welcomes hotel guests.
9 Complete: I usually ___ a break at eleven.
10 Write one piece of advice for a student who forgets homework deadlines.

Final speaking: Recommend one of the jobs from 3.4 for a candidate. Speak for 60–90 seconds. Include two abilities, two requirements, one optional action and a reason for your choice.

Final writing: Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.

Self-check: I can explain a routine; give advice; distinguish optional actions from prohibitions; discuss job requirements.') on conflict (lesson_id) do update set video_url = excluded.video_url, body = excluded.body, body_kk = excluded.body_kk, body_en = excluded.body_en;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200170', '00000000-0000-4000-8000-000000001018', 1, 'quiz', 'Unit 3 checkpoint', 'Unit 3 checkpoint', 'Unit 3 checkpoint', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', 'Choose the best answer. Review each explanation after submitting.', '{"questions":[{"question":"You ___ prepare your bag earlier.","options":["should","should to","shoulds"],"correct":0,"explanation":"Should is followed by the base verb.","explanation_en":"Should is followed by the base verb."},{"question":"She ___ wear a badge at work.","options":["have to","has to","have"],"correct":1,"explanation":"Use has to with she.","explanation_en":"Use has to with she."},{"question":"The course is optional. You …","options":["don’t have to attend","can’t attend","have to attend"],"correct":0,"explanation":"Do not have to means it is not required.","explanation_en":"Do not have to means it is not required."},{"question":"Phones are forbidden here. You …","options":["can’t use one","don’t have to use one","can use one"],"correct":0,"explanation":"Cannot expresses the prohibition.","explanation_en":"Cannot expresses the prohibition."},{"question":"___ he have to work on Saturdays?","options":["Does","Has","Is"],"correct":0,"explanation":"Use does + subject + have to.","explanation_en":"Use does + subject + have to."},{"question":"Choose the correct sentence.","options":["I can to use a computer.","I can use a computer.","I can uses a computer."],"correct":1,"explanation":"Can is followed by the base verb.","explanation_en":"Can is followed by the base verb."},{"question":"Choose the correct advice.","options":["You shouldn’t works during your break.","You shouldn’t work during your break.","You shouldn’t to work during your break."],"correct":1,"explanation":"Use the base verb after should not.","explanation_en":"Use the base verb after should not."},{"question":"Who welcomes hotel guests?","options":["a receptionist","a gardener","a delivery driver"],"correct":0,"explanation":"Welcoming guests is a receptionist’s duty.","explanation_en":"Welcoming guests is a receptionist’s duty."},{"question":"I usually ___ a break at eleven.","options":["take","do","make"],"correct":0,"explanation":"The phrase is take a break.","explanation_en":"The phrase is take a break."},{"question":"Advice about forgotten deadlines:","options":["You should use a calendar.","You should to use a calendar.","You has to calendar."],"correct":0,"explanation":"Should + base verb gives a suggestion.","explanation_en":"Should + base verb gives a suggestion."}]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
insert into public.tasks (id, lesson_id, sort, kind, title, title_kk, title_en, prompt, prompt_kk, prompt_en, data) values ('00000000-0000-4000-8000-000000200171', '00000000-0000-4000-8000-000000001018', 2, 'writing', 'Your writing', 'Your writing', 'Your writing', 'Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.', 'Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.', 'Write an 80–100 word message to a friend about a fictional new job: schedule, duties, two rules, something optional and how you plan your rest time. Use a separate final sentence to give your friend one practical suggestion with should.', '{"min_words":80,"max_words":100,"checklist":["I completed the task.","I checked the target grammar.","I used phrases from this unit."]}'::jsonb) on conflict (id) do update set lesson_id = excluded.lesson_id, sort = excluded.sort, kind = excluded.kind, title = excluded.title, title_kk = excluded.title_kk, title_en = excluded.title_en, prompt = excluded.prompt, prompt_kk = excluded.prompt_kk, prompt_en = excluded.prompt_en, data = excluded.data;
update public.lessons set is_published = false, sort = 101 where id = '00000000-0000-4000-8000-000000000101' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 102 where id = '00000000-0000-4000-8000-000000000102' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 103 where id = '00000000-0000-4000-8000-000000000103' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 104 where id = '00000000-0000-4000-8000-000000000104' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 105 where id = '00000000-0000-4000-8000-000000000105' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 106 where id = '00000000-0000-4000-8000-000000000106' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 107 where id = '00000000-0000-4000-8000-000000000107' and course_id = '00000000-0000-4000-8000-000000000100';
update public.lessons set is_published = false, sort = 108 where id = '00000000-0000-4000-8000-000000000108' and course_id = '00000000-0000-4000-8000-000000000100';
commit;
