import type { QuizQuestion } from "../lib/types.ts";

export type LocalText = { en: string; kk: string; ru: string };
type Word = [term: string, kazakh: string, russian: string, example: string];
type Lesson = {
  title: LocalText;
  goal: LocalText;
  rule: LocalText;
  tryIt: LocalText;
  model: string[];
  words: Word[];
  speak: string[];
  quiz: QuizQuestion[];
};
type Unit = {
  title: LocalText;
  outcome: LocalText;
  writing: LocalText;
  writingModel: string;
  checklist: string[];
  lessons: [Lesson, Lesson, Lesson];
  checkpoint: QuizQuestion[];
};

const t = (en: string, kk: string, ru: string): LocalText => ({ en, kk, ru });
const q = (question: string, options: [string, string, string], correct: 0 | 1 | 2): QuizQuestion => ({ question, options, correct });

export const elementaryA2Units: Unit[] = [
  {
    title: t("Meeting people", "Танысу және отбасы", "Знакомство и семья"),
    outcome: t("Introduce yourself, describe someone you know, and write a friendly email.", "Өзіңізді таныстырып, таныс адамды сипаттаңыз және досыңызға хат жазыңыз.", "Представьтесь, опишите знакомого человека и напишите дружеское письмо."),
    writing: t("Write an email to a new classmate. Say where you’re from, describe someone in your family, and ask one question. Connect two ideas with and or but.", "Жаңа топтасыңызға хат жазыңыз. Қайдан екеніңізді айтыңыз, отбасыңыздағы бір адамды сипаттаңыз және бір сұрақ қойыңыз. Екі ойды and немесе but арқылы байланыстырыңыз.", "Напишите письмо новому одногруппнику. Скажите, откуда вы, опишите родственника и задайте один вопрос. Свяжите две мысли с помощью and или but."),
    writingModel: "Hi Mina, I’m from Semey, but I live in Almaty now. My sister Aida has short hair, and she always wears glasses. Do you have any brothers or sisters? See you on Monday, Daniyar.",
    checklist: ["Say where you’re from.", "Describe a person using have or has.", "Ask one question."],
    lessons: [
      {
        title: t("The first hello", "Алғашқы танысу", "Первое знакомство"),
        goal: t("Introduce yourself and ask where another person is from.", "Өзіңізді таныстырып, басқа адамның қайдан екенін сұраңыз.", "Представьтесь и спросите, откуда ваш собеседник."),
        rule: t("Use I am, you are and she/he is. Put am, are or is before the subject in a question. To say where someone is from, use from + place; to name nationality, use an adjective: I’m from Kazakhstan. I’m Kazakhstani.", "I есімдігімен am, you есімдігімен are, she және he есімдіктерімен is қолданылады. Сұрақта am, are немесе is бастауыштың алдына шығады. Қайдан екеніңізді from + жер атауы арқылы айтыңыз: I’m from Kazakhstan. I’m Kazakhstani.", "С I используйте am, с you — are, с she и he — is. В вопросе поставьте форму be перед подлежащим. Страну называют после from, а национальность выражают прилагательным: I’m from Kazakhstan. I’m Kazakhstani."),
        tryIt: t("Imagine you arrive at a weekend class. Say your name, your city and one thing about the class. Ask your partner where they’re from.", "Демалыс күнгі сабаққа келдіңіз деп елестетіңіз. Атыңызды, қалаңызды және сабақ туралы бір ойыңызды айтыңыз. Серігіңізден қайдан екенін сұраңыз.", "Представьте, что вы пришли на занятие выходного дня. Назовите имя и город, скажите что-нибудь о занятии и спросите собеседника, откуда он."),
        model: ["Dana: Hi, I’m Dana. Are you here for the photography class?", "Leo: Yes, I am. I’m Leo. I’m from Toronto. Are you from Almaty?", "Dana: No, I’m not. I’m from Kokshetau, but I live here now."],
        words: [["classmate", "топтас", "одногруппник", "Leo is my new classmate."], ["city", "қала", "город", "Toronto is a city."], ["country", "ел", "страна", "Canada is a country."], ["Canadian", "канадалық", "канадский; канадец", "Leo is Canadian."]],
        speak: ["Hi, I’m Dana. Nice to meet you.", "I’m from Kokshetau, but I live in Almaty.", "Where are you from?"],
        quiz: [q("I ___ from Kokshetau.", ["are", "am", "is"], 1), q("___ Leo from Canada?", ["Is", "Am", "Are"], 0), q("Dana is from ___ in the dialogue.", ["Toronto", "Almaty", "Kokshetau"], 2)],
      },
      {
        title: t("The people in my family", "Менің отбасым", "Моя семья"),
        goal: t("Explain family relationships using my, your, her and ’s.", "My, your, her және ’s арқылы туыстық байланысты түсіндіріңіз.", "Расскажите о родственных связях с помощью my, your, her и ’s."),
        rule: t("Put my, your, his, her, our or their before a noun. Add ’s to one person’s name to show a relationship: Ali’s aunt. Her describes something belonging to a woman or girl, not the gender of the noun that follows.", "My, your, his, her, our немесе their сөзін зат есімнің алдына қойыңыз. Бір адамның атына ’s қосып, туыстық байланысты білдіріңіз: Ali’s aunt. Her өзінен кейінгі заттың емес, иесінің кім екенін көрсетеді.", "Местоимения my, your, his, her, our и their ставятся перед существительным. Добавьте ’s к имени одного человека: Ali’s aunt. Her указывает на обладательницу, а не на род следующего слова."),
        tryIt: t("Draw three names. Explain how each person is related to you or to someone else in the diagram.", "Үш адамның атын жазыңыз. Әрқайсысының сізге немесе сызбадағы басқа адамға кім болатынын айтыңыз.", "Запишите три имени и объясните, кем каждый человек приходится вам или другому человеку на схеме."),
        model: ["Ali is my cousin. His mother is my aunt.", "This is Ali’s sister, Sara. Her son is five.", "Our grandparents live near the river."],
        words: [["aunt", "тәте", "тётя", "My aunt lives nearby."], ["cousin", "немере туыс", "двоюродный брат или сестра", "Ali is my cousin."], ["grandparents", "ата мен әже", "бабушка и дедушка", "Our grandparents live near the river."], ["son", "ұл", "сын", "Sara’s son is five."]],
        speak: ["This is my cousin Ali.", "Ali’s mother is my aunt.", "Our grandparents live near the river."],
        quiz: [q("Sara is Ali’s sister. ___ son is five.", ["His", "Their", "Her"], 2), q("Who is Sara in the example?", ["Ali’s aunt", "Ali’s sister", "Ali’s mother"], 1), q("Which phrase means the mother of Ali?", ["Ali’s mother", "Alis mother", "Ali is mother"], 0)],
      },
      {
        title: t("A face in the crowd", "Адамның сырт келбеті", "Внешность человека"),
        goal: t("Describe someone’s appearance and make a polite request.", "Адамның сырт келбетін сипаттап, сыпайы өтініш айтыңыз.", "Опишите внешность человека и сформулируйте вежливую просьбу."),
        rule: t("Use has with he or she. Use have with I, you and they. Use be for height or age: She is tall. Use have for features: She has curly hair. Can I have …? is a polite way to ask for something.", "He және she есімдіктерімен has, I, you және they есімдіктерімен have қолданылады. Бой мен жасты be арқылы, сыртқы белгілерді have арқылы айтыңыз: She is tall. She has curly hair. Бір нәрсе сұрау үшін Can I have …? деуге болады.", "С he и she используйте has, с I, you и they — have. Рост и возраст описывают с be, волосы и другие черты — с have: She is tall. She has curly hair. Для вежливой просьбы используйте Can I have …?"),
        tryIt: t("Describe a fictional person for a friend who must meet them. Add one polite request you could make while waiting.", "Досыңыз кездестіруге тиіс ойдан шығарылған адамды сипаттаңыз. Күтіп тұрған кезде айтуға болатын бір сыпайы өтініш қосыңыз.", "Опишите вымышленного человека, которого должен встретить ваш друг. Добавьте вежливую просьбу, которую можно произнести во время ожидания."),
        model: ["Mira is tall and has curly hair. She wears round glasses.", "Mira: Can I have a glass of water, please?", "Host: Of course. Here you are."],
        words: [["curly", "бұйра", "кудрявый", "Mira has curly hair."], ["straight", "тік", "прямой", "I have straight hair."], ["glasses", "көзілдірік", "очки", "She wears glasses."], ["tall", "бойы ұзын", "высокий", "Mira is tall."]],
        speak: ["She has curly hair and round glasses.", "Can I have a glass of water, please?"],
        quiz: [q("Mira ___ curly hair.", ["is", "have", "has"], 2), q("Which request is polite?", ["Can I have some water, please?", "I water please.", "Have me water."], 0), q("Mira ___ tall.", ["has", "is", "have"], 1)],
      },
    ],
    checkpoint: [
      q("My name ___ Anel.", ["is", "am", "are"], 0), q("___ you from Aktobe?", ["Am", "Are", "Is"], 1),
      q("I live in Astana now, ___ my family lives in Taraz.", ["or", "am", "but"], 2),
      q("This is Aida. ___ father is a teacher.", ["His", "Her", "Their"], 1), q("They ___ short hair.", ["have", "is", "has"], 0),
    ],
  },
  {
    title: t("A day in your life", "Күнделікті өмір", "Повседневная жизнь"),
    outcome: t("Describe a routine and suggest a plan.", "Күн тәртібін сипаттап, жоспар ұсыныңыз.", "Опишите распорядок дня и предложите план."),
    writing: t("Write a short blog post about your ideal Saturday. Tell us what you do first, next and finally. Add one activity you like and one you don’t like.", "Өзіңізге ұнайтын сенбі туралы қысқа блог жазбасын жазыңыз. Алдымен, одан кейін және соңында не істейтініңізді айтыңыз. Бір ұнайтын және бір ұнамайтын істі қосыңыз.", "Напишите короткий пост об идеальной субботе. Расскажите, что вы делаете сначала, затем и в конце. Добавьте любимое и нелюбимое занятие."),
    writingModel: "First, I have breakfast with my family at nine. Next, I meet a friend in the park. I like taking photos, but I don’t like shopping. Finally, I cook dinner at home.",
    checklist: ["Use first, next and finally.", "Include one time.", "Use like and don’t like."],
    lessons: [
      {
        title: t("Before the city wakes up", "Таңғы күн тәртібі", "Пока город спит"),
        goal: t("Describe everyday routines in the simple present.", "Күнделікті әдеттерді осы шақта сипаттаңыз.", "Опишите повседневные привычки в простом настоящем времени."),
        rule: t("In positive sentences, add -s or -es with he, she or it. Use doesn’t + the base verb for a negative: He doesn’t take the bus. Use don’t with I, you, we and they.", "Болымды сөйлемде he, she немесе it есімдігінен кейін етістікке -s не -es қосылады. Болымсыз түрде doesn’t-тен кейін етістік бастапқы қалпында тұрады. I, you, we, they есімдіктерімен don’t қолданылады.", "В утверждениях с he, she или it добавляйте -s или -es к глаголу. После doesn’t используйте начальную форму. С I, you, we и they употребляется don’t."),
        tryIt: t("Describe your morning and a friend’s morning in three sentences. Include one thing each of you doesn’t do.", "Өз таңыңыз бен досыңыздың таңын үш сөйлеммен сипаттаңыз. Әрқайсыңыз істемейтін бір әрекетті қосыңыз.", "Опишите своё утро и утро друга в трёх предложениях. Назовите по одному действию, которое каждый из вас не делает."),
        model: ["I wake up at seven and make coffee.", "My brother starts work at six. He doesn’t have breakfast at home.", "He takes the first bus. I walk to class."],
        words: [["wake up", "ояну", "просыпаться", "I wake up at seven."], ["start work", "жұмысты бастау", "начинать работу", "He starts work at six."], ["have breakfast", "таңғы ас ішу", "завтракать", "We have breakfast at home."], ["take the bus", "автобуспен бару", "ехать на автобусе", "She takes the bus."]],
        speak: ["I wake up at seven.", "My brother starts work at six.", "He doesn’t have breakfast at home."],
        quiz: [q("My cousin ___ work at nine.", ["start", "starts", "starting"], 1), q("He doesn’t ___ the train.", ["takes", "taking", "take"], 2), q("Who walks to class in the example?", ["The speaker", "The brother", "Both people"], 0)],
      },
      {
        title: t("How often do you go?", "Қаншалықты жиі?", "Как часто вы ходите?"),
        goal: t("Say when and how often you do things.", "Істің қашан және қаншалықты жиі болатынын айтыңыз.", "Скажите, когда и как часто вы что-то делаете."),
        rule: t("Frequency words normally go before an action verb: I usually walk. With be they normally come after it: I’m often busy. Use at for a clock time, on for days and in for parts of the day.", "Жиілікті білдіретін сөздер әдетте негізгі етістіктің алдында, ал be етістігінен кейін тұрады. Сағатпен at, апта күнімен on, күннің мезгілімен in қолданылады.", "Слова частотности обычно стоят перед смысловым глаголом, но после be. С точным временем используйте at, с днями — on, с частями дня — in."),
        tryIt: t("Say the time of two activities, then explain how often you do each one.", "Екі істің уақытын айтып, әрқайсысын қаншалықты жиі істейтініңізді түсіндіріңіз.", "Назовите время двух занятий, затем скажите, как часто вы ими занимаетесь."),
        model: ["I usually swim on Tuesdays at seven.", "I’m often tired in the evening, so I sometimes read instead."],
        words: [["usually", "әдетте", "обычно", "I usually swim on Tuesdays."], ["sometimes", "кейде", "иногда", "She sometimes reads on the bus."], ["never", "ешқашан", "никогда", "We never work on Sundays."], ["in the evening", "кешке", "вечером", "I read in the evening."]],
        speak: ["I usually swim on Tuesdays.", "I’m often tired in the evening."],
        quiz: [q("The lesson starts ___ six.", ["on", "in", "at"], 2), q("Choose the usual word order.", ["I am often busy.", "I often am busy every.", "I busy often am."], 0), q("We usually play ___ Fridays.", ["at", "on", "in"], 1)],
      },
      {
        title: t("Make a Saturday plan", "Сенбіге жоспар құру", "Планы на субботу"),
        goal: t("Talk about likes and respond to suggestions.", "Ұнайтын істер туралы айтып, ұсынысқа жауап беріңіз.", "Расскажите о своих предпочтениях и ответьте на предложение."),
        rule: t("Use like + noun or like + verb-ing to talk about what you enjoy. Use Let’s + base verb or How about + -ing? to make a suggestion. Good idea! accepts it; How about Monday instead? offers a change.", "Ұнайтын іс туралы like + зат есім немесе like + -ing арқылы айтыңыз. Ұсыныс үшін Let’s + етістік немесе How about + -ing? үлгісін қолданыңыз. Good idea! келісуді білдіреді.", "Говорите о предпочтениях с like + существительное или like + глагол на -ing. Предложение можно начать с Let’s + глагол или How about + -ing? Good idea! выражает согласие."),
        tryIt: t("Suggest two activities. Say why you prefer one and agree on a time.", "Екі іс ұсыныңыз. Біреуін неге таңдайтыныңызды айтып, уақытты келісіңіз.", "Предложите два занятия. Объясните, какое нравится больше, и договоритесь о времени."),
        model: ["Nuri: I like outdoor movies. Let’s go to the park on Saturday.", "Dana: Good idea. How about meeting at six?", "Nuri: Perfect. We can get tea first."],
        words: [["outdoor movie", "ашық аспан астындағы кино", "кино под открытым небом", "There’s an outdoor movie on Saturday."], ["instead", "оның орнына", "вместо этого", "Let’s meet at six instead."], ["plan", "жоспар", "план", "We have a plan for Saturday."], ["good idea", "жақсы ой", "хорошая идея", "A trip to the park is a good idea."]],
        speak: ["Let’s go to the park on Saturday.", "How about meeting at six?"],
        quiz: [q("How about ___ at six?", ["meet", "meeting", "meets"], 1), q("Choose the suggestion.", ["I like films.", "The park is open.", "Let’s go to the park."], 2), q("Which answer accepts a suggestion?", ["Good idea!", "Last Friday.", "No, I am not."], 0)],
      },
    ],
    checkpoint: [
      q("On weekdays she ___ lunch at noon.", ["have", "has", "having"], 1), q("They ___ work on Sundays.", ["doesn’t", "aren’t", "don’t"], 2),
      q("I usually have tea ___ the morning.", ["in", "on", "at"], 0), q("What comes after First in a sequence?", ["Never", "Next", "At six"], 1),
      q("Let’s ___ for a walk.", ["going", "goes", "go"], 2),
    ],
  },
  {
    title: t("Work and study", "Жұмыс және оқу", "Работа и учёба"),
    outcome: t("Interview someone about work or study and leave a clear message.", "Жұмыс не оқу туралы сұхбаттасып, түсінікті хабар қалдырыңыз.", "Расспросите о работе или учёбе и оставьте понятное сообщение."),
    writing: t("Write a reply to a forum post: ‘I want to learn a new skill after work.’ Suggest a practical course, mention one requirement and ask a question.", "«Жұмыстан кейін жаңа дағды үйренгім келеді» деген форум жазбасына жауап жазыңыз. Бір курс ұсыныңыз, бір талабын айтыңыз және бір сұрақ қойыңыз.", "Ответьте на сообщение на форуме: «Я хочу освоить новый навык после работы». Предложите курс, назовите одно требование и задайте вопрос."),
    writingModel: "Hi Noor! You can try the evening design class. It meets on Tuesdays. You have to bring a laptop, but you don’t have to buy any software. What time do you finish work?",
    checklist: ["Suggest a course.", "Use have to or don’t have to.", "End the question with a question mark."],
    lessons: [
      {
        title: t("Ask about a job", "Жұмыс туралы сұрау", "Вопросы о работе"),
        goal: t("Ask and answer simple present yes/no questions about jobs.", "Жұмыс туралы осы шақта «иә» не «жоқ» деп жауап берілетін сұрақтар қойыңыз.", "Задавайте вопросы о работе с ответом «да» или «нет» в простом настоящем времени."),
        rule: t("Start yes/no questions with do for I, you, we or they, and does for he, she or it. Keep the main verb in its base form. Answer with Yes, I do or No, she doesn’t.", "I, you, we, they есімдіктерімен сұрақты do, ал he, she, it есімдіктерімен does сөзінен бастаңыз. Негізгі етістік бастапқы қалпында қалады. Қысқа жауап: Yes, I do немесе No, she doesn’t.", "Начинайте вопрос с do для I, you, we, they и с does для he, she, it. Основной глагол остаётся в начальной форме. Краткий ответ: Yes, I do или No, she doesn’t."),
        tryIt: t("Choose a job and write three yes/no questions that would help someone guess it.", "Мамандық таңдаңыз. Біреу оны таба алуы үшін «иә» не «жоқ» деп жауап берілетін үш сұрақ құрастырыңыз.", "Выберите профессию и составьте три общих вопроса, по которым её можно угадать."),
        model: ["Do you work in a hospital? — No, I don’t.", "Do you use a camera at work? — Yes, I do.", "Does your sister work with you? — No, she doesn’t."],
        words: [["photographer", "фотограф", "фотограф", "A photographer uses a camera."], ["receptionist", "қабылдау бөлімінің қызметкері", "администратор на стойке", "The receptionist answers calls."], ["coworker", "әріптес", "коллега", "My coworker starts at nine."], ["office", "кеңсе", "офис", "I work in an office."]],
        speak: ["Do you work in a hospital?", "Does your sister work with you?"],
        quiz: [q("___ your brother work in an office?", ["Do", "Does", "Is"], 1), q("Does she answer calls? — Yes, she ___.", ["do", "is", "does"], 2), q("Which question is correct?", ["Does he use a camera?", "Does he uses a camera?", "Do he uses a camera?"], 0)],
      },
      {
        title: t("What is required?", "Не істеу міндетті?", "Что нужно делать?"),
        goal: t("Separate requirements from choices at work or school.", "Жұмыстағы не оқудағы міндет пен таңдауды ажыратыңыз.", "Различайте обязательные и необязательные действия на работе или учёбе."),
        rule: t("Have to and has to mean something is required. Don’t have to and doesn’t have to mean there is no requirement. They do not mean the action is forbidden.", "Have to және has to әрекеттің міндетті екенін білдіреді. Don’t have to және doesn’t have to әрекеттің міндетті емес екенін білдіреді. Бұл әрекетке тыйым салынғанын білдірмейді.", "Have to и has to обозначают необходимость. Don’t have to и doesn’t have to говорят, что обязанности нет, но действие разрешено."),
        tryIt: t("Write two requirements and one choice for a new student. Add a time expression to each requirement.", "Жаңа оқушыға екі міндет пен бір еркін таңдау жазыңыз. Әр міндетке уақытын қосыңыз.", "Запишите для нового ученика два требования и одно действие по желанию. Укажите время для каждого требования."),
        model: ["On my first day, I have to arrive by nine.", "I don’t have to wear a uniform. Our trainer has to check each computer before class."],
        words: [["uniform", "арнайы киім", "форма", "You don’t have to wear a uniform."], ["by nine", "сағат тоғыздан кешікпей", "не позднее девяти", "Be here by nine."], ["sign in", "келгенін тіркеу", "отметиться", "We sign in at the front desk."], ["training", "дайындық", "обучение", "The training starts today."]],
        speak: ["I have to arrive by nine.", "I don’t have to wear a uniform."],
        quiz: [q("The training is optional. You ___ attend.", ["has to", "don’t have to", "have to"], 1), q("Our trainer ___ check the computers.", ["don’t have to", "have to", "has to"], 2), q("What does arrive by nine mean?", ["Arrive at nine or earlier.", "Arrive after nine.", "Arrive nine minutes late."], 0)],
      },
      {
        title: t("A call about a class", "Курс туралы қоңырау", "Звонок о занятиях"),
        goal: t("Ask for course information and leave a phone message.", "Курс туралы ақпарат сұрап, телефон арқылы хабар қалдырыңыз.", "Узнайте о курсе и оставьте телефонное сообщение."),
        rule: t("Use when for time, where for place, who for a person and how much for price. To leave a message, give your name, your reason for calling and a way to contact you.", "Уақытты when, орынды where, адамды who, бағаны how much арқылы сұраңыз. Хабар қалдырғанда атыңызды, қоңыраудың себебін және байланыс жолын айтыңыз.", "When спрашивает о времени, where — о месте, who — о человеке, how much — о цене. Оставьте имя, причину звонка и способ связаться с вами."),
        tryIt: t("Ask when the class starts and where to register. Then leave a short message for the teacher.", "Сабақтың қашан басталатынын және қайда тіркелуге болатынын сұраңыз. Содан кейін мұғалімге қысқа хабар қалдырыңыз.", "Спросите, когда начнётся занятие и где записаться. Затем оставьте преподавателю короткое сообщение."),
        model: ["Aziz: Hello. When does the evening course start?", "Office: It starts next Tuesday.", "Aziz: Could I leave a message for the teacher? This is Aziz. Please call me about the class."],
        words: [["enroll", "оқуға тіркелу", "записываться на курс", "Where do I enroll?"], ["take a course", "курсқа қатысу", "пройти курс", "I want to take a course after work."], ["leave a message", "хабар қалдыру", "оставить сообщение", "Can I leave a message?"], ["call back", "кері қоңырау шалу", "перезвонить", "Please call me back tomorrow."]],
        speak: ["When does the evening course start?", "Could I leave a message for the teacher?"],
        quiz: [q("___ is the course? — It’s at the library.", ["When", "Where", "How much"], 1), q("___ does it cost?", ["Who", "Where", "How much"], 2), q("What should you include in a message?", ["Your name and why you called.", "Only the weather.", "A list of every course."], 0)],
      },
    ],
    checkpoint: [
      q("___ she work on Fridays?", ["Does", "Do", "Is"], 0), q("She doesn’t ___ a laptop at work.", ["uses", "use", "using"], 1),
      q("You ___ pay today. You can pay next week.", ["has to", "are", "don’t have to"], 2),
      q("___ does the course start? — On Monday.", ["When", "Who", "Where"], 0), q("Which is a request to leave a message?", ["I leave for work at seven.", "Could I leave a message?", "Is this message old?"], 1),
    ],
  },
  {
    title: t("Homes and neighborhoods", "Үй мен аудан", "Дом и район"),
    outcome: t("Describe a place and give simple directions.", "Бір орынды сипаттап, оған қалай баруды түсіндіріңіз.", "Опишите место и объясните, как до него добраться."),
    writing: t("Write a note for a visitor. Describe your neighborhood, say what they can do there and give two directions from the nearest bus stop.", "Қонаққа қысқа жазба жазыңыз. Ауданыңызды сипаттап, онда не істеуге болатынын айтыңыз және жақын аялдамадан екі бағыт нұсқауын беріңіз.", "Напишите записку для гостя. Опишите район, скажите, чем там можно заняться, и дайте два указания от ближайшей остановки."),
    writingModel: "There’s a small market next to my apartment building. You can buy fruit there in the morning. From the bus stop, go straight and turn right at the pharmacy. My building is opposite the market.",
    checklist: ["Use there is or there are.", "Use can to describe an option.", "Give two directions."],
    lessons: [
      {
        title: t("A room to stay in", "Бөлмені сипаттау", "Комната для гостя"),
        goal: t("Describe rooms and say where objects are.", "Бөлмені және ондағы заттардың орнын сипаттаңыз.", "Опишите комнату и скажите, где находятся предметы."),
        rule: t("Use there is for one thing and there are for more than one. Ask Is there …? or Are there …? Use next to, under, on and between to say where something is.", "Бір зат үшін there is, бірнеше зат үшін there are қолданыңыз. Сұрақты Is there …? немесе Are there …? деп қойыңыз. Орынды next to, under, on және between арқылы сипаттаңыз.", "Для одного предмета используйте there is, для нескольких — there are. Вопросы начинаются с Is there …? или Are there …? Место можно описать словами next to, under, on и between."),
        tryIt: t("Describe a guest room using two prepositions. Ask whether there is a place to work.", "Қонақ бөлмесін екі орын предлогымен сипаттаңыз. Жұмыс істеуге орын бар-жоғын сұраңыз.", "Опишите комнату для гостя с двумя предлогами места. Спросите, есть ли место для работы."),
        model: ["There’s a desk next to the window. There are two chairs by the desk.", "Are there any shelves? — Yes, there are. They’re above the desk."],
        words: [["shelf", "сөре", "полка", "There’s a shelf above the desk."], ["desk", "жазу үстелі", "письменный стол", "The desk is by the window."], ["next to", "жанында", "рядом с", "The chair is next to the bed."], ["between", "арасында", "между", "The desk is between two chairs."]],
        speak: ["There’s a desk next to the window.", "Are there any shelves?"],
        quiz: [q("There ___ two chairs by the desk.", ["is", "are", "am"], 1), q("___ a lamp in the room?", ["Are there", "There are", "Is there"], 2), q("Where are the shelves in the example?", ["Above the desk.", "Under the chairs.", "Outside the room."], 0)],
      },
      {
        title: t("What can I do nearby?", "Маңайда не істеуге болады?", "Что можно сделать поблизости?"),
        goal: t("Explain what people can do in a neighborhood.", "Ауданда не істеуге болатынын түсіндіріңіз.", "Объясните, чем можно заняться в районе."),
        rule: t("Use can + base verb for an available option and can’t for something that isn’t possible. Start a yes/no question with can: Can we rent bikes here?", "Мүмкін әрекет үшін can + етістіктің бастапқы түрін, мүмкін емес әрекет үшін can’t қолданыңыз. Сұрақты can сөзінен бастаңыз: Can we rent bikes here?", "Возможность обозначают с can + начальная форма глагола, её отсутствие — с can’t. В общем вопросе поставьте can первым."),
        tryIt: t("Choose a neighborhood you know. Suggest two places and say what someone can do at each.", "Өзіңіз білетін ауданды таңдаңыз. Екі орынды ұсынып, әр жерде не істеуге болатынын айтыңыз.", "Выберите знакомый район. Назовите два места и объясните, чем можно заняться в каждом."),
        model: ["You can rent bikes near the river, but you can’t ride in the market.", "Can we buy lunch around here? — Yes, there’s a bakery next to the bus stop."],
        words: [["bakery", "наубайхана", "пекарня", "The bakery opens at eight."], ["bus stop", "автобус аялдамасы", "автобусная остановка", "Meet me at the bus stop."], ["rent a bike", "велосипед жалға алу", "взять велосипед напрокат", "You can rent a bike near the river."], ["around here", "осы маңда", "поблизости", "Is there a market around here?"]],
        speak: ["Can we buy lunch around here?", "You can rent a bike near the river."],
        quiz: [q("You can ___ a bike near the river.", ["rent", "rents", "renting"], 0), q("Where can you buy lunch in the example?", ["At the bus stop.", "At the bakery.", "On a bike."], 1), q("The library is closed. We ___ use it now.", ["doesn’t", "can", "can’t"], 2)],
      },
      {
        title: t("Find the blue building", "Көк ғимаратты табу", "Как найти синее здание"),
        goal: t("Give clear directions and identify a building.", "Жолды түсіндіріп, ғимаратты белгілерімен танытыңыз.", "Объясните дорогу и помогите узнать здание."),
        rule: t("Begin a direction with the base verb: Go straight. Turn left. Use Don’t + base verb for a negative instruction. Use an adjective before a noun: a blue building, an old station.", "Бағыт нұсқауын етістіктің бастапқы түрінен бастаңыз: Go straight. Turn left. Болымсыз нұсқау Don’t + етістік арқылы жасалады. Сын есім зат есімнің алдында тұрады.", "Начинайте указание с начальной формы глагола: Go straight. Turn left. Отрицательная инструкция строится с Don’t + глагол. Прилагательное ставится перед существительным."),
        tryIt: t("Give directions from the front door of a building to somewhere inside or nearby. Add a landmark.", "Ғимараттың кіреберісінен ішіндегі не маңайдағы бір орынға жол көрсетіңіз. Бір бағдар қосыңыз.", "Объясните маршрут от входа в здание до места внутри или рядом. Укажите один ориентир."),
        model: ["Excuse me, how do I get to the library?", "Go straight, then turn left at the pharmacy. Don’t cross the main road.", "Look for the tall blue building next to the park."],
        words: [["go straight", "тура жүріңіз", "идите прямо", "Go straight for one block."], ["turn left", "солға бұрылыңыз", "поверните налево", "Turn left at the pharmacy."], ["cross", "кесіп өту", "перейти", "Don’t cross the main road."], ["opposite", "қарсы бетінде", "напротив", "The library is opposite the park."]],
        speak: ["Go straight, then turn left at the pharmacy.", "Look for the tall blue building."],
        quiz: [q("Which gives a direction?", ["You turning left.", "Turn left at the pharmacy.", "Left is turn."], 1), q("Which order is correct?", ["a building blue", "building a blue", "a blue building"], 2), q("What should you avoid doing in the example?", ["Crossing the main road.", "Turning left.", "Looking for the library."], 0)],
      },
    ],
    checkpoint: [
      q("There ___ a bank opposite my building.", ["are", "is", "do"], 1), q("___ there two bus stops here?", ["Is", "Does", "Are"], 2), q("Can I ___ a bike near here?", ["rent", "renting", "rents"], 0),
      q("___ left after the station.", ["Turning", "Turn", "Turns"], 1), q("The green building is ___ the park and the bank.", ["under", "in", "between"], 2),
    ],
  },
  {
    title: t("Trips and travel stories", "Саяхат және сапар оқиғалары", "Поездки и истории о путешествиях"),
    outcome: t("Talk about a past trip and handle a hotel check-in.", "Өткен сапар туралы айтып, қонақүйге тіркеле біліңіз.", "Расскажите о прошедшей поездке и заселитесь в гостиницу."),
    writing: t("Write a short travel story. Say where you went, how you got there and one thing that happened. Link two ideas with so or because.", "Сапар туралы қысқа әңгіме жазыңыз. Қайда барғаныңызды, қалай жеткеніңізді және бір оқиғаны айтыңыз. Екі ойды so немесе because арқылы байланыстырыңыз.", "Напишите короткий рассказ о поездке. Скажите, куда и на чём вы ездили и что случилось. Свяжите две мысли с so или because."),
    writingModel: "Last spring, I went to Turkistan with my cousin. We took an early train because we wanted a full day in the city. It rained after lunch, so we visited a museum. The train home was quiet.",
    checklist: ["Name a place and a time.", "Use two past verbs.", "Give a reason or result with because or so."],
    lessons: [
      {
        title: t("At the station yesterday", "Кеше вокзалда", "Вчера на вокзале"),
        goal: t("Use was and were to describe transport in the past.", "Көлік пен сапарды өткен шақта was және were арқылы сипаттаңыз.", "Опишите транспорт в прошлом с was и were."),
        rule: t("Use was with I, he, she and it; use were with you, we and they. Form negatives with wasn’t and weren’t. For a question, move was or were to the front.", "I, he, she, it есімдіктерімен was, you, we, they есімдіктерімен were қолданылады. Болымсыз түрі wasn’t және weren’t. Сұрақта was немесе were алдына шығады.", "С I, he, she, it употребляется was, с you, we, they — were. Отрицания: wasn’t и weren’t. В вопросе was или were выносится вперёд."),
        tryIt: t("Think of a trip. Say where you were, whether the transport was busy, and ask one question about someone else’s trip.", "Бір сапарды еске түсіріңіз. Қайда болғаныңызды, көліктің адамға толы-толмағанын айтыңыз және басқа адамның сапары туралы бір сұрақ қойыңыз.", "Вспомните поездку. Скажите, где вы были, много ли было людей в транспорте, и задайте вопрос о чужой поездке."),
        model: ["We were at the station at seven. The train was on time.", "Was it crowded? — No, it wasn’t. There were plenty of seats."],
        words: [["train station", "теміржол вокзалы", "железнодорожный вокзал", "We were at the train station."], ["crowded", "адамға толы", "переполненный", "The bus was crowded."], ["on time", "өз уақытында", "вовремя", "Our train was on time."], ["seat", "орын", "сиденье", "There were plenty of seats."]],
        speak: ["We were at the station at seven.", "Was the train on time?"],
        quiz: [q("The train ___ on time yesterday.", ["were", "was", "is"], 1), q("___ you at the station at seven?", ["Did", "Was", "Were"], 2), q("Which sentence means the train had space?", ["It wasn’t crowded.", "It wasn’t on time.", "It was crowded."], 0)],
      },
      {
        title: t("One good trip", "Есте қалған сапар", "Одна удачная поездка"),
        goal: t("Narrate a completed trip using regular and irregular verbs.", "Аяқталған сапарды дұрыс және бұрыс етістіктер арқылы әңгімелеңіз.", "Расскажите о завершившейся поездке с правильными и неправильными глаголами."),
        rule: t("Add -ed to most regular past verbs: visit → visited. Learn common irregular forms as pairs: go → went, take → took, see → saw. The past form stays the same for all subjects.", "Көптеген дұрыс етістіктің өткен шағына -ed қосылады: visit → visited. Бұрыс етістіктерді жұппен жаттаңыз: go → went, take → took, see → saw. Өткен шақ формасы жаққа қарай өзгермейді.", "У большинства правильных глаголов в прошедшем времени добавляется -ed. Неправильные пары нужно запомнить: go → went, take → took, see → saw. Прошедшая форма одинакова для всех лиц."),
        tryIt: t("Write three sentences about a journey. Use at least one regular verb and two irregular verbs.", "Сапар туралы үш сөйлем жазыңыз. Кемінде бір дұрыс және екі бұрыс етістік қолданыңыз.", "Напишите три предложения о поездке. Используйте хотя бы один правильный и два неправильных глагола."),
        model: ["Last Sunday, I went to a lake with my aunt. We took the bus and walked from the village.", "We saw wild horses. We stayed for three hours and then returned home."],
        words: [["journey", "сапар", "путешествие", "The journey took two hours."], ["visit", "бару; аралау", "посещать", "We visited a museum."], ["return", "қайту", "возвращаться", "We returned home in the evening."], ["take a bus", "автобуспен бару", "поехать на автобусе", "We took a bus to the lake."]],
        speak: ["Last Sunday, I went to a lake.", "We saw wild horses and returned home at six."],
        quiz: [q("Last Sunday we ___ to the lake.", ["go", "goed", "went"], 2), q("I ___ the museum yesterday.", ["visited", "visiting", "visit"], 0), q("What did they see in the example?", ["A train station.", "Wild horses.", "A city park."], 1)],
      },
      {
        title: t("Questions about a trip", "Сапар жайлы сұрақтар", "Вопросы о поездке"),
        goal: t("Ask past questions and explain a change of plan.", "Өткен сапар туралы сұрап, жоспардың өзгеруін түсіндіріңіз.", "Задайте вопросы о прошлой поездке и объясните изменение плана."),
        rule: t("Use did + subject + base verb for most past questions and didn’t + base verb for negatives. Use was or were without did when the main verb is be. At a hotel, use present phrases for what you need now.", "Өткен шақтағы сұрақта did + бастауыш + етістіктің бастапқы түрі, болымсыз сөйлемде didn’t + бастапқы түр қолданылады. Негізгі етістік be болса, did қолданбай was не were айтыңыз.", "Большинство вопросов в прошлом строится с did + подлежащее + начальная форма, отрицания — с didn’t + начальная форма. С глаголом be используйте was или were без did."),
        tryIt: t("Ask a partner two questions about a trip. Then role-play arriving at a hotel with a booking.", "Серігіңізден сапары жайлы екі сұрақ сұраңыз. Кейін броньмен қонақүйге келген жағдайды ойнаңыз.", "Задайте собеседнику два вопроса о поездке. Затем разыграйте разговор при заселении в гостиницу с бронью."),
        model: ["Did you stay near the beach? — No, we didn’t. We stayed in town.", "At the hotel: Hello, I have a reservation under Sadykov. What time is breakfast?"],
        words: [["reservation", "алдын ала тапсырыс", "бронь", "I have a reservation under Sadykov."], ["check in", "қонақүйге тіркелу", "заселяться", "Can I check in now?"], ["front desk", "қабылдау орны", "стойка регистрации", "The keys are at the front desk."], ["stay in town", "қалада тұру", "остановиться в городе", "We stayed in town last night."]],
        speak: ["Did you stay near the beach?", "Hello. I have a reservation under Sadykov."],
        quiz: [q("Did you ___ in town?", ["stayed", "stay", "stays"], 1), q("We didn’t ___ breakfast at the hotel.", ["had", "has", "have"], 2), q("Which phrase works when checking in?", ["I have a reservation under Sadykov.", "I took the train yesterday.", "I usually eat at six."], 0)],
      },
    ],
    checkpoint: [
      q("We ___ in Turkistan last week.", ["were", "was", "did"], 0), q("I ___ a train to the city.", ["take", "took", "taked"], 1), q("What did you ___ after lunch?", ["did", "doing", "do"], 2),
      q("I stayed inside ___ it rained.", ["because", "so", "or"], 0), q("I didn’t ___ the museum yesterday.", ["visited", "visit", "visits"], 1),
    ],
  },
  {
    title: t("Food and meals", "Тағам және ас ішу", "Еда и приёмы пищи"),
    outcome: t("Talk about ingredients, order a meal, and write a short review.", "Құрамын айтып, асқа тапсырыс беріңіз және қысқа пікір жазыңыз.", "Расскажите об ингредиентах, закажите блюдо и напишите короткий отзыв."),
    writing: t("Write a short review of a real or imaginary restaurant. Say what you ordered, describe the food, and recommend one dish to a friend.", "Нақты не ойдан шығарылған мейрамхана туралы қысқа пікір жазыңыз. Не алғаныңызды айтып, тағамды сипаттаңыз және досыңызға бір тағам ұсыныңыз.", "Напишите короткий отзыв о настоящем или вымышленном ресторане. Расскажите, что заказали, опишите еду и порекомендуйте другу одно блюдо."),
    writingModel: "I went to a small café near the station. I ordered a bowl of soup and some bread. The soup was hot and fresh. My friend liked the salad, too. Try the soup if you visit.",
    checklist: ["Name two items you ordered.", "Use one adjective to describe a dish.", "Give one recommendation."],
    lessons: [
      {
        title: t("What’s in the kitchen?", "Асүйде не бар?", "Что есть на кухне?"),
        goal: t("Sort food into count and noncount nouns and ask what is available.", "Тағам атауларын саналатын және саналмайтын зат есімдерге бөліп, не барын сұраңыз.", "Различайте исчисляемые и неисчисляемые названия продуктов и спрашивайте, что есть."),
        rule: t("Use a or an for one countable item: an egg. Use some with plurals or noncount nouns in positive statements. Any is common in questions and negatives. Some is also common in polite requests: Can I have some water?", "Бір саналатын зат үшін a немесе an айтыңыз: an egg. Болымды сөйлемде көпше және саналмайтын зат есімдермен some, сұрақ пен болымсыз сөйлемде көбіне any қолданылады. Сыпайы өтініште some де айтылады.", "С одним исчисляемым предметом используйте a или an. В утверждениях с множественным числом и неисчисляемыми словами употребляйте some. Any часто стоит в вопросах и отрицаниях; some употребляется и в вежливой просьбе."),
        tryIt: t("Make a list for lunch. Say what you have and ask about two things you need.", "Түскі асқа тізім жасаңыз. Не барын айтып, қажет екі зат туралы сұраңыз.", "Составьте список на обед. Скажите, что у вас уже есть, и спросите о двух нужных продуктах."),
        model: ["We have some bread and an egg. Do we have any tomatoes?", "No, we don’t have any. Can I have some water before we go shopping?"],
        words: [["egg", "жұмыртқа", "яйцо", "I need an egg."], ["bread", "нан", "хлеб", "We have some bread."], ["rice", "күріш", "рис", "Do we have any rice?"], ["tomato", "қызанақ", "помидор", "There are three tomatoes."]],
        speak: ["We have some bread and an egg.", "Do we have any tomatoes?"],
        quiz: [q("I need ___ egg.", ["a", "an", "any"], 1), q("We don’t have ___ rice.", ["a", "an", "any"], 2), q("Which word is usually noncount here?", ["Bread", "Egg", "Tomato"], 0)],
      },
      {
        title: t("Enough for four people", "Төрт адамға жететін ас", "Хватит на четверых"),
        goal: t("Ask about quantities and use containers to measure food.", "Мөлшерін сұрап, азықты ыдыс не өлшем бірлігімен айтыңыз.", "Спросите о количестве и назовите продукты с единицами измерения."),
        rule: t("Ask How many? about plural countable items and How much? about noncount nouns. A lot of works with both. Use a bottle of water or a bag of rice to count packages.", "Көпше саналатын затпен How many?, саналмайтын затпен How much? сұрағын қойыңыз. A lot of екі түрімен де қолданылады. Ыдыс пен қаптаманы a bottle of water немесе a bag of rice деп санауға болады.", "С исчисляемыми словами во множественном числе спрашивайте How many?, с неисчисляемыми — How much? A lot of подходит для обоих типов. Чтобы посчитать упаковки, скажите a bottle of water или a bag of rice."),
        tryIt: t("Plan dinner for four. Ask about two quantities, then give a shopping list with at least two containers.", "Төрт адамға кешкі ас жоспарлаңыз. Екі мөлшерді сұрап, кемінде екі қаптамасы бар тізім жасаңыз.", "Спланируйте ужин на четверых. Задайте два вопроса о количестве и составьте список покупок минимум с двумя упаковками."),
        model: ["How many apples do we need? — Four.", "How much juice do we have? — Not much. Let’s buy two bottles of juice and a bag of rice."],
        words: [["a bottle of", "бір бөтелке", "бутылка", "We need two bottles of juice."], ["a bag of", "бір қап", "пакет", "Buy a bag of rice."], ["a bowl of", "бір тостаған", "миска", "I’d like a bowl of soup."], ["enough", "жеткілікті", "достаточно", "There’s enough juice for everyone."]],
        speak: ["How many apples do we need?", "We need two bottles of juice."],
        quiz: [q("How ___ rice do we need?", ["many", "a lot", "much"], 2), q("How ___ apples do you want?", ["many", "much", "a"], 0), q("Choose the natural phrase.", ["two juices of bottle", "two bottles of juice", "two bottle juice"], 1)],
      },
      {
        title: t("From a recipe to an order", "Ас дайындау және тапсырыс беру", "От рецепта к заказу"),
        goal: t("Explain a short recipe and order food politely.", "Қысқа рецептті түсіндіріп, сыпайы тапсырыс беріңіз.", "Объясните короткий рецепт и вежливо закажите еду."),
        rule: t("Use a or an when you first mention one item, then the when the listener knows which item you mean. Use no article when talking about food in general. To order, use I’d like …, please.", "Бір затты алғаш атағанда a не an, кейін нақты қай зат екенін білеміз дегенде the қолданыңыз. Жалпы тағам түрі туралы айтқанда артикль қажет емес. Тапсырыс үшін I’d like …, please үлгісін айтыңыз.", "При первом упоминании одного предмета используйте a или an, а затем the, если уже ясно, о каком предмете речь. Говоря о продукте в целом, опускайте артикль. Для заказа используйте I’d like …, please."),
        tryIt: t("Give three steps for making a simple dish. Then order it and a drink as if you were in a café.", "Қарапайым тағамның үш қадамын айтыңыз. Кейін дәмханада отырғандай сол тағам мен сусынға тапсырыс беріңіз.", "Назовите три шага приготовления простого блюда. Затем закажите блюдо и напиток, как в кафе."),
        model: ["Take a tomato. Chop the tomato and put it in a bowl. Add some cheese.", "Server: Are you ready to order? — Yes. I’d like the tomato salad and some tea, please."],
        words: [["chop", "турау", "нарезать", "Chop the tomato."], ["mix", "араластыру", "смешивать", "Mix the cheese and vegetables."], ["menu", "ас мәзірі", "меню", "Could I see the menu?"], ["order", "тапсырыс беру", "заказывать", "We’re ready to order."]],
        speak: ["Chop the tomato and put it in a bowl.", "I’d like the salad and some tea, please."],
        quiz: [q("Take a tomato. Then chop ___ tomato.", ["a", "an", "the"], 2), q("Choose the polite order.", ["I’d like the soup, please.", "Soup me.", "Have soup me, please."], 0), q("Which action uses a knife?", ["Mix the ingredients.", "Chop the tomato.", "Order tea."], 1)],
      },
    ],
    checkpoint: [
      q("Do you have ___ milk?", ["any", "an", "a"], 0), q("How ___ bowls do we need?", ["much", "many", "any"], 1), q("I bought a cake. ___ cake was delicious.", ["An", "Some", "The"], 2),
      q("Can I have a ___ of water?", ["bottle", "bread", "tomato"], 0), q("Which sentence recommends a dish?", ["The menu is on the table.", "Try the pumpkin soup.", "I sat near the door."], 1),
    ],
  },
];
