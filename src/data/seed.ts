// Starter content: the plans, payment settings and sample courses a new school
// opens with. The demo mode reads it directly; `npm run seed:sql` turns it into
// supabase/seed.sql for a real project. Everything here is editable in the admin.
import type {
  Course,
  Lesson,
  LessonMaterials,
  PaymentSettings,
  Plan,
  Task,
} from "../lib/types";

const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export type SeedLesson = Lesson & { materials: LessonMaterials; tasks: Task[] };
export type SeedCourse = Course & { lessons: SeedLesson[] };

export const seedPlans: Plan[] = [
  {
    id: id(1),
    title: "1 месяц",
    title_kk: "1 ай",
    title_en: "1 month",
    description: "Попробовать формат и пройти первый курс.",
    description_kk: "Форматты байқап, алғашқы курсты өту үшін.",
    description_en: "Try the format and complete your first course.",
    days: 30,
    price: 7000,
    old_price: null,
    featured: false,
    is_active: true,
    sort: 1,
  },
  {
    id: id(2),
    title: "3 месяца",
    title_kk: "3 ай",
    title_en: "3 months",
    description: "Оптимально, чтобы подняться на один уровень.",
    description_kk: "Бір деңгейге көтерілу үшін оңтайлы.",
    description_en: "The best option to move up one level.",
    days: 90,
    price: 17900,
    old_price: 21000,
    featured: true,
    is_active: true,
    sort: 2,
  },
  {
    id: id(3),
    title: "12 месяцев",
    title_kk: "12 ай",
    title_en: "12 months",
    description: "Весь путь от A1 до B2 в своём темпе.",
    description_kk: "A1-ден B2-ге дейінгі бүкіл жол өз қарқыныңызбен.",
    description_en: "The whole path from A1 to B2 at your own pace.",
    days: 365,
    price: 56900,
    old_price: 84000,
    featured: false,
    is_active: true,
    sort: 3,
  },
];

export const seedPaymentSettings: PaymentSettings = {
  qr_url: "/kaspi-qr.png",
  pay_url: "https://pay.kaspi.kz/pay/fnxqvpzh",
  recipient: "English City (ИП НУРАХМЕТ)",
  instructions:
    "Откройте приложение Kaspi.kz, нажмите «Kaspi QR» и отсканируйте код. Проверьте сумму и подтвердите платёж. После оплаты вернитесь на эту страницу и укажите имя плательщика и номер телефона, с которого платили.",
  instructions_kk:
    "Kaspi.kz қосымшасын ашып, «Kaspi QR» батырмасын басыңыз да, кодты сканерлеңіз. Соманы тексеріп, төлемді растаңыз. Төлегеннен кейін осы бетке оралып, төлеушінің атын және төлем жасалған телефон нөмірін көрсетіңіз.",
  instructions_en: "Open the Kaspi.kz app, tap “Kaspi QR” and scan the code. Check the amount and confirm the payment. After paying, come back to this page and enter the payer's name and the phone number you paid from.",
};

const lesson = (
  n: number,
  courseId: string,
  sort: number,
  fields: Partial<Lesson> & Pick<Lesson, "title" | "title_kk" | "title_en">,
  materials: Partial<LessonMaterials>,
  tasks: Array<Omit<Task, "id" | "lesson_id" | "sort">>,
): SeedLesson => ({
  id: id(n),
  course_id: courseId,
  sort,
  summary: "",
  summary_kk: "",
  summary_en: "",
  minutes: 10,
  is_free: false,
  is_published: true,
  ...fields,
  materials: { lesson_id: id(n), video_url: "", body: "", body_kk: "", body_en: "", ...materials },
  tasks: tasks.map((task, index) => ({
    ...task,
    id: id(n * 100 + index + 1),
    lesson_id: id(n),
    sort: index + 1,
  })),
});

const B1 = id(100);
const A1 = id(200);
const A2 = id(300);
const BUSINESS = id(400);
const CUTTS_TALK = "https://www.youtube.com/watch?v=UNP03fDSj1U";

export const seedCourses: SeedCourse[] = [
  {
    id: A1,
    slug: "first-steps-a1",
    title: "First Steps",
    title_kk: "First Steps",
    title_en: "First Steps",
    subtitle: "Английский с нуля: знакомство, числа, первые фразы",
    subtitle_kk: "Ағылшын тілі нөлден: танысу, сандар, алғашқы сөйлемдер",
    subtitle_en: "English from scratch: introductions, numbers, first phrases",
    description:
      "Курс для тех, кто начинает с самого начала. Учимся здороваться, рассказывать о себе и понимать простые вопросы. Каждое слово можно прослушать и повторить за диктором.",
    description_kk:
      "Ең басынан бастайтындарға арналған курс. Сәлемдесуді, өзіңіз туралы айтуды және қарапайым сұрақтарды түсінуді үйренеміз. Әр сөзді тыңдап, дикторға қайталауға болады.",
    description_en: "A course for complete beginners. Learn to say hello, talk about yourself and understand simple questions. You can listen to every word and repeat after the speaker.",
    level: "A1",
    category: "general",
    glyph: "Hi!",
    cover_url: "",
    is_published: true,
    sort: 1,
    lessons: [
      lesson(
        201,
        A1,
        1,
        {
          title: "Hello! Знакомимся",
          title_kk: "Hello! Танысамыз",
          title_en: "Hello! Let's meet",
          summary: "Приветствия и рассказ о себе в трёх фразах.",
          summary_kk: "Сәлемдесу және өзіңіз туралы үш сөйлем.",
          summary_en: "Greetings and introducing yourself in three phrases.",
          minutes: 12,
          is_free: true,
        },
        {
          body: "## Как представиться\nВ английском знакомство строится из трёх коротких фраз:\n- **Hello! My name is Aruzhan.** — Привет! Меня зовут Аружан.\n- **I'm from Almaty.** — Я из Алматы.\n- **Nice to meet you!** — Приятно познакомиться!\n\nПрослушайте каждую фразу, повторите вслух и запишите себя в задании ниже.",
          body_kk:
            "## Қалай таныстыру керек\nАғылшын тілінде танысу үш қысқа сөйлемнен тұрады:\n- **Hello! My name is Aruzhan.** — Сәлем! Менің атым Аружан.\n- **I'm from Almaty.** — Мен Алматыданмын.\n- **Nice to meet you!** — Танысқаныма қуаныштымын!\n\nӘр сөйлемді тыңдап, дауыстап қайталаңыз да, төмендегі тапсырмада өзіңізді жазып алыңыз.",
          body_en: "## How to introduce yourself\nIn English, an introduction is built from three short phrases:\n- **Hello! My name is Aruzhan.**\n- **I'm from Almaty.**\n- **Nice to meet you!**\n\nListen to each phrase, repeat it out loud and record yourself in the task below.",
        },
        [
          {
            kind: "vocabulary",
            title: "Слова для знакомства",
            title_kk: "Танысу сөздері",
            title_en: "Words for introductions",
            prompt: "Переверните карточку, прослушайте слово и отметьте, знаете ли вы его.",
            prompt_kk: "Карточканы аударып, сөзді тыңдаңыз да, білетініңізді белгілеңіз.",
            prompt_en: "Flip the card, listen to the word and mark whether you know it.",
            data: {
              words: [
                { term: "hello", ru: "привет, здравствуйте", kk: "сәлем, сәлеметсіз бе", example: "Hello! How are you?" },
                { term: "my name is", ru: "меня зовут", kk: "менің атым", example: "My name is Dana." },
                { term: "nice to meet you", ru: "приятно познакомиться", kk: "танысқаныма қуаныштымын", example: "Nice to meet you, Dana!" },
                { term: "where are you from?", ru: "откуда вы?", kk: "қай жерденсіз?", example: "Where are you from? — I'm from Astana." },
                { term: "goodbye", ru: "до свидания", kk: "сау болыңыз", example: "Goodbye! See you tomorrow." },
              ],
            },
          },
          {
            kind: "pronunciation",
            title: "Скажите о себе",
            title_kk: "Өзіңіз туралы айтыңыз",
            title_en: "Talk about yourself",
            prompt: "Прослушайте фразу, запишите себя и посмотрите, какие слова распознались.",
            prompt_kk: "Сөйлемді тыңдап, өзіңізді жазып алыңыз да, қай сөздер танылғанын қараңыз.",
            prompt_en: "Listen to the phrase, record yourself and see which words were recognised.",
            data: {
              phrases: [
                { text: "Hello! My name is Aruzhan.", hint: "Подставьте своё имя — система проверит остальные слова.", hint_kk: "Өз атыңызды қойыңыз — жүйе қалған сөздерді тексереді.", hint_en: "Use your own name — the system will check the other words." },
                { text: "I'm from Almaty.", hint: "Звук /m/ в I'm не проглатываем.", hint_kk: "I'm сөзіндегі /m/ дыбысын жұтып қоймаңыз.", hint_en: "Don't swallow the /m/ sound in I'm." },
                { text: "Nice to meet you!", hint: "Ударение на meet.", hint_kk: "Екпін meet сөзіне түседі.", hint_en: "The stress falls on meet." },
              ],
            },
          },
          {
            kind: "quiz",
            title: "Проверьте себя",
            title_kk: "Өзіңізді тексеріңіз",
            title_en: "Check yourself",
            prompt: "Выберите правильный вариант.",
            prompt_kk: "Дұрыс нұсқаны таңдаңыз.",
            prompt_en: "Choose the correct option.",
            data: {
              questions: [
                {
                  question: "— Nice to meet you! — …",
                  options: ["Nice to meet you too!", "Goodbye, too!", "My name is too."],
                  correct: 0,
                  explanation: "На «Nice to meet you» отвечают «Nice to meet you too».",
                  explanation_kk: "«Nice to meet you» дегенге «Nice to meet you too» деп жауап береді.",
                  explanation_en: "The reply to “Nice to meet you” is “Nice to meet you too”.",
                },
                {
                  question: "Where ___ you from?",
                  options: ["is", "are", "am"],
                  correct: 1,
                  explanation: "С you всегда используется are.",
                  explanation_kk: "you сөзімен әрқашан are қолданылады.",
                  explanation_en: "With you we always use are.",
                },
                {
                  question: "I ___ from Shymkent.",
                  options: ["is", "are", "am"],
                  correct: 2,
                  explanation: "С I используется am: I am = I'm.",
                  explanation_kk: "I сөзімен am қолданылады: I am = I'm.",
                  explanation_en: "With I we use am: I am = I'm.",
                },
              ],
            },
          },
        ],
      ),
      lesson(
        202,
        A1,
        2,
        {
          title: "Numbers & phone numbers",
          title_kk: "Сандар және телефон нөмірі",
          title_en: "Numbers & phone numbers",
          summary: "Числа от 0 до 20 и как продиктовать номер телефона.",
          summary_kk: "0-ден 20-ға дейінгі сандар және телефон нөмірін айту.",
          summary_en: "Numbers from 0 to 20 and how to say a phone number.",
          minutes: 10,
        },
        {
          body: "## Номер телефона по-английски\nЦифры называют по одной: **seven, seven, zero, one…** Ноль часто читают как **oh**. Две одинаковые цифры подряд можно сказать как **double**: 77 — **double seven**.",
          body_kk:
            "## Телефон нөмірі ағылшынша\nЦифрларды бір-бірден атайды: **seven, seven, zero, one…** Нөлді көбіне **oh** деп оқиды. Қатар тұрған екі бірдей цифрды **double** деп айтуға болады: 77 — **double seven**.",
          body_en: "## Phone numbers in English\nSay the digits one by one: **seven, seven, zero, one…** Zero is often read as **oh**. Two identical digits in a row can be said with **double**: 77 — **double seven**.",
        },
        [
          {
            kind: "vocabulary",
            title: "Числа",
            title_kk: "Сандар",
            title_en: "Numbers",
            prompt: "Повторите числа вслух вместе с диктором.",
            prompt_kk: "Сандарды дикторға ілесіп дауыстап қайталаңыз.",
            prompt_en: "Repeat the numbers out loud with the speaker.",
            data: {
              words: [
                { term: "three", ru: "три", kk: "үш", example: "I have three sisters." },
                { term: "eight", ru: "восемь", kk: "сегіз", example: "The lesson starts at eight." },
                { term: "thirteen", ru: "тринадцать", kk: "он үш", example: "She is thirteen." },
                { term: "thirty", ru: "тридцать", kk: "отыз", example: "Thirty minutes a day." },
                { term: "double seven", ru: "две семёрки (77)", kk: "екі жеті (77)", example: "My number starts with double seven." },
              ],
            },
          },
          {
            kind: "pronunciation",
            title: "Продиктуйте номер",
            title_kk: "Нөміріңізді айтыңыз",
            title_en: "Say your number",
            prompt: "Скажите номер так, как его произносят носители.",
            prompt_kk: "Нөмірді тілді меңгергендер айтатындай айтыңыз.",
            prompt_en: "Say the number the way native speakers do.",
            data: {
              phrases: [
                { text: "My number is double seven oh one.", hint: "oh — так часто читают ноль.", hint_kk: "oh — нөлді көбіне осылай оқиды.", hint_en: "oh — this is how zero is often read." },
                { text: "Thirteen, not thirty.", hint: "В thirteen ударение на -teen, в thirty — на thir-.", hint_kk: "thirteen сөзінде екпін -teen-ге, thirty сөзінде thir-ге түседі.", hint_en: "In thirteen the stress is on -teen, in thirty it's on thir-." },
              ],
            },
          },
        ],
      ),
    ],
  },
  {
    id: A2,
    slug: "clear-pronunciation-a2",
    title: "Clear Pronunciation",
    title_kk: "Clear Pronunciation",
    title_en: "Clear Pronunciation",
    subtitle: "Звуки, которых нет в русском и казахском",
    subtitle_kk: "Қазақ және орыс тілдерінде жоқ дыбыстар",
    subtitle_en: "Sounds that don't exist in Russian or Kazakh",
    description:
      "Тренажёр произношения: слушаете эталон, записываете себя, сразу видите, какие слова прозвучали неразборчиво, а преподаватель даёт обратную связь голосом.",
    description_kk:
      "Айтылым тренажері: эталонды тыңдайсыз, өзіңізді жазасыз, қай сөздер анық естілмегенін бірден көресіз, ал оқытушы дауыспен кері байланыс береді.",
    description_en: "A pronunciation trainer: listen to the model, record yourself, instantly see which words were unclear, and get voice feedback from a teacher.",
    level: "A2",
    category: "speaking",
    glyph: "/θ/",
    cover_url: "",
    is_published: true,
    sort: 2,
    lessons: [
      lesson(
        301,
        A2,
        1,
        {
          title: "The TH sound",
          title_kk: "TH дыбысы",
          title_en: "The TH sound",
          summary: "Межзубные /θ/ и /ð/: think, this, three.",
          summary_kk: "Тіс аралық /θ/ және /ð/: think, this, three.",
          summary_en: "The dental sounds /θ/ and /ð/: think, this, three.",
          minutes: 15,
          is_free: true,
        },
        {
          body: "## Как поставить звук TH\nКончик языка слегка выглядывает между зубами, воздух проходит над ним.\n- **/θ/** — глухой: think, three, thank you\n- **/ð/** — звонкий: this, that, mother\n\nНе заменяйте TH на «с», «з» или «ф» — так слово может превратиться в другое: **think → sink**.",
          body_kk:
            "## TH дыбысын қалай қою керек\nТілдің ұшы тістің арасынан сәл көрініп тұрады, ауа оның үстінен өтеді.\n- **/θ/** — қатаң: think, three, thank you\n- **/ð/** — ұяң: this, that, mother\n\nTH дыбысын «с», «з» немесе «ф» дыбысымен алмастырмаңыз — сөз басқа сөзге айналуы мүмкін: **think → sink**.",
          body_en: "## How to make the TH sound\nThe tip of your tongue peeks out slightly between your teeth, and air flows over it.\n- **/θ/** — voiceless: think, three, thank you\n- **/ð/** — voiced: this, that, mother\n\nDon't replace TH with “s”, “z” or “f” — the word can turn into a different one: **think → sink**.",
        },
        [
          {
            kind: "pronunciation",
            title: "Скороговорки с TH",
            title_kk: "TH дыбысы бар жаңылтпаштар",
            title_en: "TH tongue twisters",
            prompt: "Сначала прослушайте медленно, затем запишите себя.",
            prompt_kk: "Алдымен баяу тыңдап, содан кейін өзіңізді жазыңыз.",
            prompt_en: "Listen at slow speed first, then record yourself.",
            data: {
              phrases: [
                { text: "I think three is enough.", hint: "think и three — глухой /θ/.", hint_kk: "think пен three — қатаң /θ/.", hint_en: "think and three — voiceless /θ/." },
                { text: "This is my mother.", hint: "this и mother — звонкий /ð/.", hint_kk: "this пен mother — ұяң /ð/.", hint_en: "this and mother — voiced /ð/." },
                { text: "Thank you for the thoughtful gift.", hint: "Три TH подряд — не торопитесь.", hint_kk: "Қатарынан үш TH — асықпаңыз.", hint_en: "Three THs in a row — take your time." },
              ],
            },
          },
        ],
      ),
      lesson(
        302,
        A2,
        2,
        {
          title: "Word stress",
          title_kk: "Сөздегі екпін",
          title_en: "Word stress",
          summary: "Где ставить ударение в длинных словах.",
          summary_kk: "Ұзын сөздерде екпінді қайда қою керек.",
          summary_en: "Where to put the stress in long words.",
          minutes: 12,
        },
        {
          body: "## Ударение меняет смысл\nВ английском ударный слог длиннее и громче, а безударные звучат коротко и нечётко.\n- **PREsent** — подарок, **preSENT** — представлять\n- **PHOtograph**, **phoTOgrapher**, **photoGRAPHic** — ударение «переезжает» вместе с суффиксом.",
          body_kk:
            "## Екпін мағынаны өзгертеді\nАғылшын тілінде екпінді буын ұзақ әрі қатты айтылады, ал екпінсіз буындар қысқа әрі анық емес естіледі.\n- **PREsent** — сыйлық, **preSENT** — ұсыну\n- **PHOtograph**, **phoTOgrapher**, **photoGRAPHic** — екпін жұрнақпен бірге «көшеді».",
          body_en: "## Stress changes meaning\nIn English, the stressed syllable is longer and louder, while unstressed ones sound short and unclear.\n- **PREsent** — a gift, **preSENT** — to show or introduce\n- **PHOtograph**, **phoTOgrapher**, **photoGRAPHic** — the stress “moves” along with the suffix.",
        },
        [
          {
            kind: "pronunciation",
            title: "Ударение в словах",
            title_kk: "Сөздердегі екпін",
            title_en: "Stress in words",
            prompt: "Выделяйте ударный слог голосом.",
            prompt_kk: "Екпінді буынды дауыспен ерекшелеңіз.",
            prompt_en: "Stress the key syllable with your voice.",
            data: {
              phrases: [
                { text: "The photographer took a beautiful photograph.", hint: "phoTOgrapher, PHOtograph", hint_kk: "phoTOgrapher, PHOtograph", hint_en: "phoTOgrapher, PHOtograph" },
                { text: "I want to present my present.", hint: "preSENT (глагол), PREsent (существительное)", hint_kk: "preSENT (етістік), PREsent (зат есім)", hint_en: "preSENT (verb), PREsent (noun)" },
              ],
            },
          },
          {
            kind: "quiz",
            title: "Где ударение?",
            title_kk: "Екпін қайда?",
            title_en: "Where's the stress?",
            prompt: "Выберите вариант с правильным ударением.",
            prompt_kk: "Екпіні дұрыс қойылған нұсқаны таңдаңыз.",
            prompt_en: "Choose the option with the correct stress.",
            data: {
              questions: [
                { question: "comfortable", options: ["COMfortable", "comFORtable", "comforTAble"], correct: 0, explanation: "COM-fta-ble: ударение на первый слог, середина почти не звучит.", explanation_kk: "COM-fta-ble: екпін бірінші буынға түседі, ортасы дерлік естілмейді.", explanation_en: "COM-fta-ble: the stress is on the first syllable, the middle is almost silent." },
                { question: "important", options: ["IMportant", "imPORtant", "importANT"], correct: 1, explanation: "imPORtant — ударение на второй слог.", explanation_kk: "imPORtant — екпін екінші буынға түседі.", explanation_en: "imPORtant — the stress is on the second syllable." },
              ],
            },
          },
        ],
      ),
    ],
  },
  {
    id: B1,
    slug: "everyday-english-b1",
    title: "Everyday English",
    title_kk: "Everyday English",
    title_en: "Everyday English",
    subtitle: "Истории, перемены и уверенная речь в прошедшем времени",
    subtitle_kk: "Әңгімелер, өзгерістер және өткен шақта сенімді сөйлеу",
    subtitle_en: "Stories, changes and confident speaking in the past tense",
    description:
      "Юнит о новых начинаниях: словарь для рассказа о переменах, past simple и past continuous, чтение, аудирование по TED-выступлению, собственная история вслух и письменно. Задания на речь и письмо проверяет преподаватель.",
    description_kk:
      "Жаңа бастамалар туралы бөлім: өзгерістер туралы айтуға арналған сөздер, past simple және past continuous, оқу, TED баяндамасы бойынша тыңдалым, өз әңгімеңізді ауызша және жазбаша айту. Сөйлеу мен жазу тапсырмаларын оқытушы тексереді.",
    description_en: "A unit about new beginnings: vocabulary for talking about change, past simple and past continuous, reading, listening to a TED talk, and telling your own story out loud and in writing. A teacher checks the speaking and writing tasks.",
    level: "B1",
    category: "general",
    glyph: "New",
    cover_url: "",
    is_published: true,
    sort: 3,
    lessons: [
      lesson(
        101,
        B1,
        1,
        {
          title: "Start here",
          title_kk: "Бастайық",
          title_en: "Start here",
          summary: "Когда вы в последний раз пробовали что-то новое?",
          summary_kk: "Соңғы рет қашан жаңа нәрсені байқап көрдіңіз?",
          summary_en: "When did you last try something new?",
          minutes: 5,
          is_free: true,
        },
        {
          video_url: CUTTS_TALK,
          body: "## When did you last try something new?\nВ этом юните вы будете говорить о переменах в жизни, понимать чужие истории и расскажете свою.\n\nПосмотрите короткое выступление: автор 30 дней подряд пробовал что-то новое. Попробуйте уловить главную мысль — детали разберём позже.",
          body_kk:
            "## When did you last try something new?\nБұл бөлімде өмірдегі өзгерістер туралы сөйлейсіз, басқалардың әңгімелерін түсінесіз және өз әңгімеңізді айтасыз.\n\nҚысқа баяндаманы көріңіз: автор 30 күн қатарынан жаңа нәрсе байқап көрген. Негізгі ойын ұстауға тырысыңыз — егжей-тегжейін кейін талдаймыз.",
          body_en: "## When did you last try something new?\nIn this unit you'll talk about changes in life, understand other people's stories and tell your own.\n\nWatch a short talk: the speaker tried something new for 30 days in a row. Try to catch the main idea — we'll look at the details later.",
        },
        [
          {
            kind: "writing",
            title: "Разминка",
            title_kk: "Дайындық",
            title_en: "Warm-up",
            prompt: "Think of one thing you started recently. What made you begin? Напишите 2–3 предложения.",
            prompt_kk: "Think of one thing you started recently. What made you begin? 2–3 сөйлем жазыңыз.",
            prompt_en: "Think of one thing you started recently. What made you begin? Write 2–3 sentences.",
            data: { min_words: 15, max_words: 80, checklist: [] },
          },
        ],
      ),
      lesson(
        102,
        B1,
        2,
        {
          title: "People & routines",
          title_kk: "Адамдар мен күн тәртібі",
          title_en: "People & routines",
          summary: "Фразы, чтобы рассказать о переменах.",
          summary_kk: "Өзгерістер туралы айтуға арналған тіркестер.",
          summary_en: "Phrases for talking about change.",
          minutes: 12,
        },
        {
          body: "## Build your word power\nЭти фразы помогут рассказать о новом опыте. Выучите их как готовые блоки — не по одному слову.",
          body_kk: "## Build your word power\nБұл тіркестер жаңа тәжірибе туралы айтуға көмектеседі. Оларды жеке сөз емес, дайын блок ретінде жаттаңыз.",
          body_en: "## Build your word power\nThese phrases will help you talk about new experiences. Learn them as ready-made chunks — not word by word.",
        },
        [
          {
            kind: "vocabulary",
            title: "Фразы юнита",
            title_kk: "Бөлім тіркестері",
            title_en: "Unit phrases",
            prompt: "Переверните карточку и повторите фразу вслух.",
            prompt_kk: "Карточканы аударып, тіркесті дауыстап қайталаңыз.",
            prompt_en: "Flip the card and repeat the phrase out loud.",
            data: {
              words: [
                { term: "settle in", ru: "освоиться на новом месте", kk: "жаңа ортаға үйрену", example: "It took me a month to settle in." },
                { term: "get to know", ru: "познакомиться поближе", kk: "танысып-білу", example: "I got to know my colleagues at lunch." },
                { term: "sign up", ru: "записаться", kk: "тіркелу", example: "She signed up for a photography walk." },
                { term: "give something a try", ru: "попробовать что-то", kk: "бір нәрсені байқап көру", example: "Why not give yoga a try?" },
                { term: "turning point", ru: "поворотный момент", kk: "бетбұрыс", example: "That evening was a turning point." },
                { term: "step outside your comfort zone", ru: "выйти из зоны комфорта", kk: "үйреншікті ортадан шығу", example: "Speaking English helps me step outside my comfort zone." },
              ],
            },
          },
          {
            kind: "pronunciation",
            title: "Фразы в речи",
            title_kk: "Сөйлеудегі тіркестер",
            title_en: "Phrases in speech",
            prompt: "Произнесите фразы целиком, с естественным ритмом.",
            prompt_kk: "Тіркестерді табиғи ырғақпен тұтас айтыңыз.",
            prompt_en: "Say each phrase as a whole, with a natural rhythm.",
            data: {
              phrases: [
                { text: "It took me a month to settle in.", hint: "settle in звучит слитно: settlin.", hint_kk: "settle in бірге айтылады: settlin.", hint_en: "settle in is linked together: settlin." },
                { text: "Why not give it a try?", hint: "give it a — почти одно слово.", hint_kk: "give it a — бір сөз сияқты.", hint_en: "give it a — almost one word." },
                { text: "That evening was a turning point.", hint: "Ударение на TURNing.", hint_kk: "Екпін TURNing-ке түседі.", hint_en: "The stress is on TURNing." },
              ],
            },
          },
        ],
      ),
      lesson(
        103,
        B1,
        3,
        {
          title: "Stories in progress",
          title_kk: "Өткен шақтағы оқиғалар",
          title_en: "Stories in progress",
          summary: "Past simple и past continuous в одной истории.",
          summary_kk: "Бір әңгімедегі past simple және past continuous.",
          summary_en: "Past simple and past continuous in one story.",
          minutes: 15,
        },
        {
          body: "## Past simple + past continuous\n- **Past continuous** — фоновое действие, которое длилось: **I was waiting for a bus.**\n- **Past simple** — событие, которое его прервало: **I saw a poster.**\n\nВместе: **While I was waiting for a bus, I saw a poster.**\n\n## Окончание -ed\nУ правильных глаголов -ed звучит тремя способами: **/t/** (noticed), **/d/** (learned), **/ɪd/** (started — после t и d).",
          body_kk:
            "## Past simple + past continuous\n- **Past continuous** — ұзаққа созылған фондық әрекет: **I was waiting for a bus.**\n- **Past simple** — оны бөлген оқиға: **I saw a poster.**\n\nБірге: **While I was waiting for a bus, I saw a poster.**\n\n## -ed жалғауы\nДұрыс етістіктерде -ed үш түрлі айтылады: **/t/** (noticed), **/d/** (learned), **/ɪd/** (started — t және d дыбыстарынан кейін).",
          body_en: "## Past simple + past continuous\n- **Past continuous** — a background action that was in progress: **I was waiting for a bus.**\n- **Past simple** — the event that interrupted it: **I saw a poster.**\n\nTogether: **While I was waiting for a bus, I saw a poster.**\n\n## The -ed ending\nIn regular verbs, -ed is pronounced in three ways: **/t/** (noticed), **/d/** (learned), **/ɪd/** (started — after t and d).",
        },
        [
          {
            kind: "pronunciation",
            title: "Окончание -ed",
            title_kk: "-ed жалғауы",
            title_en: "The -ed ending",
            prompt: "Следите за последним звуком глагола.",
            prompt_kk: "Етістіктің соңғы дыбысына назар аударыңыз.",
            prompt_en: "Pay attention to the last sound of the verb.",
            data: {
              phrases: [
                { text: "I noticed that my self-confidence grew.", hint: "noticed — короткий глухой /t/, без лишнего слога.", hint_kk: "noticed — қысқа қатаң /t/, артық буынсыз.", hint_en: "noticed — a short voiceless /t/, no extra syllable." },
                { text: "I learned that small changes stick.", hint: "learned — звонкий /d/.", hint_kk: "learned — ұяң /d/.", hint_en: "learned — a voiced /d/." },
                { text: "As I started to do harder challenges, I grew more confident.", hint: "started — дополнительный слог: start-id.", hint_kk: "started — қосымша буын: start-id.", hint_en: "started — an extra syllable: start-id." },
              ],
            },
          },
          {
            kind: "quiz",
            title: "Grammar practice",
            title_kk: "Grammar practice",
            title_en: "Grammar practice",
            prompt: "Выберите правильную форму.",
            prompt_kk: "Дұрыс форманы таңдаңыз.",
            prompt_en: "Choose the correct form.",
            data: {
              questions: [
                {
                  question: "I ___ home when I ___ an old friend.",
                  options: ["walked / was seeing", "was walking / saw", "was walking / was seeing"],
                  correct: 1,
                  explanation: "Фоновое действие — past continuous, событие — past simple.",
                  explanation_kk: "Ұзақ әрекетке past continuous, оны бөлген оқиғаға past simple қолданылады.",
                  explanation_en: "Background action — past continuous; the event — past simple.",
                },
                {
                  question: "While Amina ___ dinner, the lights ___.",
                  options: ["made / were going out", "was making / went out", "made / went out"],
                  correct: 1,
                  explanation: "Ужин уже готовился, когда погас свет.",
                  explanation_kk: "Тамақ дайындау жүріп жатқанда жарық өшті.",
                  explanation_en: "Dinner was already being made when the lights went out.",
                },
                {
                  question: "Which sentence gives two actions in sequence?",
                  options: ["I opened the email and called my sister.", "I was opening the email while I called.", "I opened the email when I was call."],
                  correct: 0,
                  explanation: "Для завершённых действий одно за другим — past simple.",
                  explanation_kk: "Бірінен кейін бірі аяқталған әрекеттерге past simple қолданылады.",
                  explanation_en: "For finished actions that happen one after another, use past simple.",
                },
                {
                  question: "At 8 p.m. yesterday, we ___ for the train.",
                  options: ["waited", "were waiting", "was waiting"],
                  correct: 1,
                  explanation: "Действие в процессе в конкретный момент прошлого — past continuous.",
                  explanation_kk: "Белгілі бір өткен уақытта жүріп жатқан әрекет past continuous болады.",
                  explanation_en: "An action in progress at a specific moment in the past — past continuous.",
                },
              ],
            },
          },
        ],
      ),
      lesson(
        104,
        B1,
        4,
        {
          title: "A new beginning",
          title_kk: "Жаңа бастама",
          title_en: "A new beginning",
          summary: "Читаем историю Даны: что изменило её планы?",
          summary_kk: "Дананың әңгімесін оқимыз: оның жоспарын не өзгертті?",
          summary_en: "Read Dana's story: what changed her plans?",
          minutes: 15,
        },
        {
          body: "## One decision, a new direction\nПрочитайте короткую историю и ответьте на вопросы.\n\nLast spring, Dana was working in a busy office in Astana. She liked her colleagues, but she felt that every day was the same. One evening, while she was waiting for a bus, she saw a poster for a weekend photography walk.\n\nDana nearly walked past it. Then she remembered the camera her grandfather had given her and signed up. During the walk, she met people who saw the city in a completely different way. Six months later, she still works at the same office — but now she also photographs local events. That rainy evening became a small turning point.",
          body_kk: "",
          body_en: "## One decision, a new direction\nRead the short story and answer the questions.\n\nLast spring, Dana was working in a busy office in Astana. She liked her colleagues, but she felt that every day was the same. One evening, while she was waiting for a bus, she saw a poster for a weekend photography walk.\n\nDana nearly walked past it. Then she remembered the camera her grandfather had given her and signed up. During the walk, she met people who saw the city in a completely different way. Six months later, she still works at the same office — but now she also photographs local events. That rainy evening became a small turning point.",
        },
        [
          {
            kind: "quiz",
            title: "Reading check",
            title_kk: "Reading check",
            title_en: "Reading check",
            prompt: "Ответьте по тексту.",
            prompt_kk: "Мәтін бойынша жауап беріңіз.",
            prompt_en: "Answer based on the text.",
            data: {
              questions: [
                {
                  question: "Why did Dana notice the photography poster?",
                  options: ["She was looking for a new job.", "She saw it while waiting for a bus.", "Her colleague showed it to her."],
                  correct: 1,
                  explanation: "В тексте: she saw the poster while she was waiting for a bus.",
                  explanation_kk: "Ол автобусты күтіп тұрғанда плакатты көрді.",
                  explanation_en: "In the text: she saw the poster while she was waiting for a bus.",
                },
                {
                  question: "What nearly stopped Dana from joining?",
                  options: ["She almost walked past the poster.", "She did not own a camera.", "The walk was in another city."],
                  correct: 0,
                  explanation: "«Nearly walked past it» — она чуть не прошла мимо.",
                  explanation_kk: "«Nearly walked past it» — ол мүмкіндікті елемей кете жаздады.",
                  explanation_en: "“Nearly walked past it” — she almost walked by without noticing.",
                },
                {
                  question: "What does “turning point” mean in this story?",
                  options: ["A difficult journey home", "A small event that changed her direction", "The place where the bus turned"],
                  correct: 1,
                  explanation: "Этот вечер изменил то, как Дана проводит свободное время.",
                  explanation_kk: "Бұл кеш Дананың бос уақытын және қаланы көру тәсілін өзгертті.",
                  explanation_en: "That evening changed how Dana spends her free time.",
                },
              ],
            },
          },
        ],
      ),
      lesson(
        105,
        B1,
        5,
        {
          title: "A 30-day experiment",
          title_kk: "30 күндік эксперимент",
          title_en: "A 30-day experiment",
          summary: "Аудирование по TED-выступлению и шэдоуинг.",
          summary_kk: "TED баяндамасы бойынша тыңдалым және шэдоуинг.",
          summary_en: "Listening to a TED talk and shadowing.",
          minutes: 12,
        },
        {
          video_url: CUTTS_TALK,
          body: "## Watch twice\nПервый раз — для главной мысли. Второй — с субтитрами на английском, чтобы ответить на вопросы. Затем повторите ключевые фразы вслух за спикером.",
          body_kk: "## Екі рет көріңіз\nБірінші рет — негізгі ой үшін. Екінші рет — сұрақтарға жауап беру үшін ағылшынша субтитрмен. Содан кейін негізгі сөйлемдерді спикерге ілесіп дауыстап қайталаңыз.",
          body_en: "## Watch twice\nThe first time — for the main idea. The second time — with English subtitles, to answer the questions. Then repeat the key phrases out loud after the speaker.",
        },
        [
          {
            kind: "quiz",
            title: "Listening check",
            title_kk: "Listening check",
            title_en: "Listening check",
            prompt: "Ответьте после просмотра.",
            prompt_kk: "Көріп болғаннан кейін жауап беріңіз.",
            prompt_en: "Answer after watching.",
            data: {
              questions: [
                {
                  question: "What is Matt’s main message?",
                  options: ["Change your whole life in one day.", "Try one meaningful change consistently for 30 days.", "Avoid difficult challenges."],
                  correct: 1,
                  explanation: "30 дней — достаточно, чтобы попробовать новую привычку и заметить перемены.",
                  explanation_kk: "Оның ойынша, жаңа әдетті байқап көруге және өзгерісті сезуге 30 күн жеткілікті.",
                  explanation_en: "30 days is enough to try a new habit and notice a change.",
                },
                {
                  question: "Which daily challenge made the month more memorable?",
                  options: ["Taking one photograph", "Cycling up a mountain", "Giving up all technology"],
                  correct: 0,
                  explanation: "Он фотографировал каждый день и помнил, где был и что делал.",
                  explanation_kk: "Ол күн сайын суретке түсіріп, сол күндері қайда және не істеп жүргенін есте сақтады.",
                  explanation_en: "He took a photo every day and remembered where he was and what he was doing.",
                },
                {
                  question: "What happened as his challenges became harder?",
                  options: ["He became less interested.", "His self-confidence grew.", "He stopped after one month."],
                  correct: 1,
                  explanation: "Более сложные челленджи сделали его увереннее.",
                  explanation_kk: "Күрделірек сынақтар оның сенімін арттырып, батылырақ болуына көмектесті.",
                  explanation_en: "Harder challenges made him more confident.",
                },
                {
                  question: "Which changes were more likely to ‘stick’?",
                  options: ["Small sustainable changes", "Big crazy challenges", "Changes suggested by other people"],
                  correct: 0,
                  explanation: "Небольшие реалистичные изменения чаще становятся привычкой.",
                  explanation_kk: "Жалғастыруға болатын шағын, тұрақты өзгерістер әдетке айналуы ықтимал болды.",
                  explanation_en: "Small, realistic changes are more likely to become habits.",
                },
              ],
            },
          },
          {
            kind: "pronunciation",
            title: "Shadowing",
            title_kk: "Shadowing",
            title_en: "Shadowing",
            prompt: "Повторите ключевые фразы спикера с той же интонацией.",
            prompt_kk: "Спикердің негізгі сөйлемдерін сондай интонациямен қайталаңыз.",
            prompt_en: "Repeat the speaker's key phrases with the same intonation.",
            data: {
              phrases: [
                { text: "I decided to try something new for 30 days.", hint: "Скажите на одном дыхании.", hint_kk: "Бір демде айтыңыз.", hint_en: "Say it in one breath." },
                { text: "The months were much more memorable.", hint: "Ударение на MUCH и MEMorable.", hint_kk: "Екпін MUCH және MEMorable сөздеріне түседі.", hint_en: "The stress is on MUCH and MEMorable." },
              ],
            },
          },
        ],
      ),
      lesson(
        106,
        B1,
        6,
        {
          title: "Tell your story",
          title_kk: "Өз оқиғаңды айт",
          title_en: "Tell your story",
          summary: "Рассказ на 60 секунд о первом опыте.",
          summary_kk: "Алғашқы тәжірибе туралы 60 секундтық әңгіме.",
          summary_en: "A 60-second story about a first experience.",
          minutes: 10,
        },
        {
          body: "## Your 60-second story\nРасскажите о том, как вы что-то сделали впервые.\n- **Set the scene** — где вы были, что делали?\n- **Describe the moment** — что произошло, что вы почувствовали?\n- **Reflect** — чему это вас научило?\n\nСначала потренируйте модельную историю ниже — преподаватель послушает и даст советы.",
          body_kk:
            "## Your 60-second story\nБір нәрсені алғаш рет қалай жасағаныңыз туралы айтыңыз.\n- **Set the scene** — қайда болдыңыз, не істеп жүрдіңіз?\n- **Describe the moment** — не болды, не сезіндіңіз?\n- **Reflect** — бұл сізге не үйретті?\n\nАлдымен төмендегі үлгі әңгімені жаттықтырыңыз — оқытушы тыңдап, кеңес береді.",
          body_en: "## Your 60-second story\nTell us about a time you did something for the first time.\n- **Set the scene** — where were you, what were you doing?\n- **Describe the moment** — what happened, how did you feel?\n- **Reflect** — what did it teach you?\n\nFirst practise the model story below — a teacher will listen and give you tips.",
        },
        [
          {
            kind: "pronunciation",
            title: "Модельная история",
            title_kk: "Үлгі әңгіме",
            title_en: "Model story",
            prompt: "Прочитайте историю по фразам.",
            prompt_kk: "Әңгімені сөйлем бойынша оқыңыз.",
            prompt_en: "Read the story phrase by phrase.",
            data: {
              phrases: [
                { text: "Last summer I was living in Almaty and working long hours." },
                { text: "One day a friend invited me to a climbing class." },
                { text: "I was terrified, but I reached the top of the wall." },
                { text: "Now I know that fear is just the first step." },
              ],
            },
          },
        ],
      ),
      lesson(
        107,
        B1,
        7,
        {
          title: "An unforgettable day",
          title_kk: "Ұмытылмас күн",
          title_en: "An unforgettable day",
          summary: "Письменная история на 100–120 слов.",
          summary_kk: "100–120 сөзден тұратын жазбаша әңгіме.",
          summary_en: "A written story of 100–120 words.",
          minutes: 20,
        },
        {
          body: "## Write: An unforgettable day\nНапишите 100–120 слов. Используйте выражения времени и оба прошедших времени.\n\nПолезные связки: **At first… / While I was… / Suddenly… / In the end…**",
          body_kk:
            "## Write: An unforgettable day\n100–120 сөз жазыңыз. Уақыт тіркестерін және өткен шақтың екі түрін де қолданыңыз.\n\nПайдалы байланыстырғыштар: **At first… / While I was… / Suddenly… / In the end…**",
          body_en: "## Write: An unforgettable day\nWrite 100–120 words. Use time expressions and both past tenses.\n\nUseful linkers: **At first… / While I was… / Suddenly… / In the end…**",
        },
        [
          {
            kind: "writing",
            title: "Your story",
            title_kk: "Your story",
            title_en: "Your story",
            prompt: "Write about an unforgettable day in your life.",
            prompt_kk: "Write about an unforgettable day in your life.",
            prompt_en: "Write about an unforgettable day in your life.",
            data: {
              min_words: 100,
              max_words: 120,
              checklist: [
                "I set the scene clearly.",
                "I used past simple and past continuous.",
                "I checked spelling and punctuation.",
              ],
            },
          },
        ],
      ),
      lesson(
        108,
        B1,
        8,
        {
          title: "Checkpoint",
          title_kk: "Білімді тексеру",
          title_en: "Checkpoint",
          summary: "Итоговый тест по юниту.",
          summary_kk: "Бөлім бойынша қорытынды тест.",
          summary_en: "Final test for the unit.",
          minutes: 10,
        },
        { body: "## Unit checkpoint\nКороткий тест по грамматике, чтению и аудированию. Можно проходить сколько угодно раз — сохраняется лучший результат.", body_kk: "## Unit checkpoint\nГрамматика, оқу және тыңдалым бойынша қысқа тест. Қанша рет болса да өтуге болады — ең жақсы нәтиже сақталады.", body_en: "## Unit checkpoint\nA short test on grammar, reading and listening. You can take it as many times as you like — your best result is saved." },
        [
          {
            kind: "quiz",
            title: "Unit check",
            title_kk: "Unit check",
            title_en: "Unit check",
            prompt: "",
            prompt_kk: "",
            prompt_en: "",
            data: {
              questions: [
                {
                  question: "I ___ home when I ___ an old friend.",
                  options: ["walked / was seeing", "was walking / saw", "was walking / was seeing"],
                  correct: 1,
                  explanation: "Фоновое действие — past continuous, событие — past simple.",
                  explanation_kk: "Ұзақ әрекетке past continuous, оны бөлген оқиғаға past simple қолданылады.",
                  explanation_en: "Background action — past continuous; the event — past simple.",
                },
                {
                  question: "What does “turning point” mean?",
                  options: ["A difficult journey home", "A small event that changed someone's direction", "The place where the bus turned"],
                  correct: 1,
                },
                {
                  question: "Which changes are more likely to ‘stick’?",
                  options: ["Small sustainable changes", "Big crazy challenges", "Changes suggested by other people"],
                  correct: 0,
                },
              ],
            },
          },
        ],
      ),
    ],
  },
  {
    id: BUSINESS,
    slug: "business-english-b2",
    title: "Business English",
    title_kk: "Business English",
    title_en: "Business English",
    subtitle: "Письма, созвоны и small talk с коллегами",
    subtitle_kk: "Хаттар, қоңыраулар және әріптестермен small talk",
    subtitle_en: "Emails, calls and small talk with colleagues",
    description:
      "Для тех, кто работает с иностранными коллегами: вежливые письма, участие во встречах, уточнения и просьбы. Письменные задания проверяет преподаватель.",
    description_kk:
      "Шетелдік әріптестермен жұмыс істейтіндерге: сыпайы хаттар, кездесулерге қатысу, нақтылау және өтініштер. Жазбаша тапсырмаларды оқытушы тексереді.",
    description_en: "For people who work with international colleagues: polite emails, taking part in meetings, clarifying and making requests. A teacher checks the writing tasks.",
    level: "B2",
    category: "business",
    glyph: "Re:",
    cover_url: "",
    is_published: true,
    sort: 4,
    lessons: [
      lesson(
        401,
        BUSINESS,
        1,
        {
          title: "Polite emails",
          title_kk: "Сыпайы хаттар",
          title_en: "Polite emails",
          summary: "Как просить, напоминать и отказывать вежливо.",
          summary_kk: "Сыпайы түрде өтіну, еске салу және бас тарту.",
          summary_en: "How to ask, remind and say no politely.",
          minutes: 15,
          is_free: true,
        },
        {
          body: "## Смягчаем просьбу\nВместо **Send me the report** — **Could you send me the report by Friday?**\n\nВместо **You forgot** — **Just a quick reminder about…**\n\nВместо **No** — **Unfortunately, I won't be able to… Would Thursday work instead?**",
          body_kk:
            "## Өтінішті жұмсартамыз\n**Send me the report** орнына — **Could you send me the report by Friday?**\n\n**You forgot** орнына — **Just a quick reminder about…**\n\n**No** орнына — **Unfortunately, I won't be able to… Would Thursday work instead?**",
          body_en: "## Softening a request\nInstead of **Send me the report** — **Could you send me the report by Friday?**\n\nInstead of **You forgot** — **Just a quick reminder about…**\n\nInstead of **No** — **Unfortunately, I won't be able to… Would Thursday work instead?**",
        },
        [
          {
            kind: "vocabulary",
            title: "Фразы для писем",
            title_kk: "Хаттарға арналған тіркестер",
            title_en: "Email phrases",
            prompt: "",
            prompt_kk: "",
            prompt_en: "",
            data: {
              words: [
                { term: "Could you…?", ru: "Не могли бы вы…?", kk: "…бере аласыз ба?", example: "Could you share the slides?" },
                { term: "Just a quick reminder", ru: "Небольшое напоминание", kk: "Қысқаша еске салу", example: "Just a quick reminder about tomorrow's call." },
                { term: "Unfortunately", ru: "К сожалению", kk: "Өкінішке қарай", example: "Unfortunately, I can't join the meeting." },
                { term: "Would … work for you?", ru: "Вам подойдёт…?", kk: "…сізге ыңғайлы ма?", example: "Would 3 p.m. work for you?" },
              ],
            },
          },
          {
            kind: "writing",
            title: "Напишите письмо",
            title_kk: "Хат жазыңыз",
            title_en: "Write an email",
            prompt: "Your manager asked for a report by Monday, but you need two more days. Write a polite email (60–90 words).",
            prompt_kk: "Your manager asked for a report by Monday, but you need two more days. Write a polite email (60–90 words).",
            prompt_en: "Your manager asked for a report by Monday, but you need two more days. Write a polite email (60–90 words).",
            data: {
              min_words: 60,
              max_words: 90,
              checklist: ["I explained the reason briefly.", "I suggested a new deadline.", "I used polite phrases from the lesson."],
            },
          },
        ],
      ),
    ],
  },
];
