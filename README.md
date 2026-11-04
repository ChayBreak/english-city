# English City

Онлайн-школа английского: каталог курсов по уровням, подписка на весь каталог с оплатой через Kaspi QR и ручной проверкой платежа, видеоуроки с YouTube, задания (произношение, тесты, письмо, словарь) и админка для наполнения сайта и проверки работ. Интерфейс и материалы на русском, казахском и английском.

Дизайн построен на системе Verba (вторая версия: фиолетовый бренд, шрифт Plus Jakarta Sans, боковое меню). Токены лежат в `src/styles/tokens.css`, стили компонентов в `src/styles/app.css`. Шрифты подключены из npm-пакетов `@fontsource-variable/*`, без Google Fonts. У Plus Jakarta Sans нет кириллицы, поэтому русский и казахский текст набирается Manrope, как задано в системе.

## Запуск локально

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:5173. Без ключей Supabase он работает в демо-режиме: данные хранятся в браузере, а на странице входа можно зайти как студент или как администратор. Как подключить настоящую базу, описано в [supabase/README.md](supabase/README.md).

## Команды

| Команда | Что делает |
| --- | --- |
| `npm run dev` | dev-сервер |
| `npm test` | тесты (Vitest) |
| `npm run lint` | ESLint |
| `npm run build` | проверка типов и сборка в `dist/` |
| `npm run seed:sql` | пересобрать `supabase/seed.sql` из `src/data/seed.ts` |

## Структура

- `src/pages`: страницы студента (главная, каталог, курс, урок, тарифы, оплата, вход, кабинет).
- `src/tasks`: задания. Произношение работает так: эталонная озвучка через speechSynthesis, запись через MediaRecorder, автопроверка через SpeechRecognition (Chrome и Edge).
- `src/admin`: админка (оплаты, проверка заданий, студенты, курсы и уроки, тарифы, Kaspi QR).
- `src/lib/backend.ts`: единый интерфейс данных. Реализации: `supabaseBackend.ts` для продакшна и `demoBackend.ts` для демо.
- `src/lib/dict.ts`: тексты интерфейса RU/KZ/EN.
- `supabase/migrations`: схема БД с правилами доступа.

## Деплой

В проекте лежит `vercel.json`: это SPA-роутинг и сборка Vite. При деплое на Vercel добавьте переменные окружения `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`, а адрес сайта пропишите в Supabase: Site URL и Redirect URLs.
