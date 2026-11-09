// Compile the reviewed editorial source into the application's native task types.
import { readFileSync, writeFileSync } from 'node:fs';
const source = readFileSync(new URL('../content/pre-intermediate-units-1-3.md', import.meta.url), 'utf8');
const uuid = n => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const courseId = uuid(100);
const checkpoints = [
  [
    ['She ___ yoga every morning.', ['do','does','goes'],1,'She takes does with the activity yoga.'],
    ['___ you play any sports?', ['Do','Does','Are'],0,'Use do with you and a main verb.'],
    ['How often ___ your brother go swimming?', ['do','does','is'],1,'Use does with a singular third-person subject.'],
    ['We ___ watch sport on TV.', ["don’t","doesn’t","aren’t"],0,'Use do not with we.'],
    ['Choose the correct sentence.', ['I usually stay in on Mondays.','I stay usually in on Mondays.','I usually stays in on Mondays.'],0,'Usually comes before the main verb.'],
    ['Choose the correct negative.', ["He doesn’t likes football.","He doesn’t like football.","He don’t like football."],1,'After does not, use the base verb.'],
    ['Choose the correct question.', ['Do you interested in music?','Are you interested in music?','Does you interested in music?'],1,'Interested takes be.'],
    ['Twice a week means …', ['every two weeks','two times each week','every day'],1,'Twice means two times.'],
    ['I ___ photos of buildings.', ['take','do','play'],0,'The phrase is take photos.'],
    ['A useful follow-up to “I go cycling” is …', ['Where do you go cycling?','Where you cycling?','Where does you go?'],0,'Ask for more detail with a correctly formed question.'],
  ],
  [
    ['Yesterday I ___ a new club.', ['join','joined','joining'],1,'Yesterday signals a completed past event.'],
    ['We ___ home early.', ["didn’t went","didn’t go","don’t went"],1,'Use the base form after did not.'],
    ['___ you enjoy the class?', ['Did','Were','Does'],0,'Use did for past questions with enjoy.'],
    ['She ___ nervous before the lesson.', ['were','was','did'],1,'Use was with she.'],
    ['Choose the correct question.', ['Did he took the bus?','Did he take the bus?','Does he took the bus?'],1,'Use take after did.'],
    ['I met Sara ___ September.', ['at','on','in'],2,'Use in with months.'],
    ['We played football two days ___.', ['last','ago','yesterday'],1,'Ago follows the time period.'],
    ['The past simple of feel is …', ['feeled','felt','fallen'],1,'Feel is irregular: felt.'],
    ['Which ending adds a syllable?', ['walked','played','wanted'],2,'After /t/, -ed is pronounced /ɪd/.'],
    ['Choose the sentence giving a reason.', ['I stayed home because I felt tired.','I stayed home but I felt tired.','I stayed home then I felt tired.'],0,'Because introduces the reason.'],
  ],
  [
    ['You ___ prepare your bag earlier.', ['should','should to','shoulds'],0,'Should is followed by the base verb.'],
    ['She ___ wear a badge at work.', ['have to','has to','have'],1,'Use has to with she.'],
    ['The course is optional. You …', ["don’t have to attend","can’t attend","have to attend"],0,'Do not have to means it is not required.'],
    ['Phones are forbidden here. You …', ["can’t use one","don’t have to use one","can use one"],0,'Cannot expresses the prohibition.'],
    ['___ he have to work on Saturdays?', ['Does','Has','Is'],0,'Use does + subject + have to.'],
    ['Choose the correct sentence.', ['I can to use a computer.','I can use a computer.','I can uses a computer.'],1,'Can is followed by the base verb.'],
    ['Choose the correct advice.', ["You shouldn’t works during your break.","You shouldn’t work during your break.","You shouldn’t to work during your break."],1,'Use the base verb after should not.'],
    ['Who welcomes hotel guests?', ['a receptionist','a gardener','a delivery driver'],0,'Welcoming guests is a receptionist’s duty.'],
    ['I usually ___ a break at eleven.', ['take','do','make'],0,'The phrase is take a break.'],
    ['Advice about forgotten deadlines:', ['You should use a calendar.','You should to use a calendar.','You has to calendar.'],0,'Should + base verb gives a suggestion.'],
  ],
];
const sections = [...source.matchAll(/^### ([123])\.([1-6]) (.+?) · (\d+) minutes\r?\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)];
if (sections.length !== 18) throw new Error(`Expected 18 lessons, found ${sections.length}`);
const lessons = sections.map((m, index) => {
  const unit = Number(m[1]), number = Number(m[2]), lessonId = uuid(1001 + index);
  const title = `${unit}.${number} ${m[3]}`;
  let body = m[5].trim();
  const summary = body.match(/^Goal: (.+)$/m)?.[1] ?? `Unit ${unit} checkpoint and project.`;
  if (body.includes('Recording script:')) body = '**Transcript practice:** Audio is not yet available. Read the dialogue, then answer the questions. A teacher may read it aloud with this transcript hidden.\n\n' + body.replaceAll('First listen:', 'First reading:').replaceAll('Second listen:', 'Second reading:').replaceAll('Before listening:', 'Before reading:');
  const tasks = [];
  const task = (kind, title, prompt, data) => tasks.push({id: uuid(200000 + index * 10 + tasks.length),lesson_id:lessonId,sort:tasks.length+1,kind,title,title_kk:title,title_en:title,prompt,prompt_kk:prompt,prompt_en:prompt,data});
  if (number === 1) {
    const words = [...body.matchAll(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)].slice(1).map(row => ({term:row[1].trim(),ru:row[2].trim(),kk:'',example:row[3].trim()}));
    task('vocabulary','Useful phrases','Recall the phrase, check its meaning and say your own example.',{words});
    task('pronunciation','Say it clearly','Listen to each example, repeat it, then record yourself.',{phrases:words.slice(0,6).map(w=>({text:w.example}))});
  }
  if (number === 6) {
    task('quiz',`Unit ${unit} checkpoint`,'Choose the best answer. Review each explanation after submitting.',{questions:checkpoints[unit-1].map(([question,options,correct,explanation])=>({question,options,correct,explanation,explanation_en:explanation}))});
  }
  const written = body.match(/(?:Final writing:|Writing:|Write:) ([\s\S]*?)(?=\n\n|$)/)?.[1];
  const spoken = body.match(/(?:Final speaking:|Speaking:|Role-play:|Task:) ([\s\S]*?)(?=\n\n|$)/)?.[1];
  // Free speech is submitted as a written script with an explicit recording activity
  // in the materials; fixed-phrase pronunciation must not pretend to grade free speech.
  task('writing', written ? 'Your writing' : 'Your response', written ?? `${spoken ?? summary}\nWrite your response or the script for your conversation. Complete the speaking activity aloud as well.`,{min_words:number===6?80:30,max_words:number===6?100:120,checklist:['I completed the task.','I checked the target grammar.','I used phrases from this unit.']});
  // The lesson renderer supports lists, not Markdown tables.
  body = body.replace(/^\| Phrase \| Russian support \| Example \|\r?\n\|[-| ]+\|\r?\n/gm,'').replace(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm,(_,phrase,meaning,example)=>`- **${phrase.trim()}** — ${meaning.trim()}. ${example.trim()}`);
  return {id:lessonId,course_id:courseId,sort:index+1,title,title_kk:title,title_en:title,summary,summary_kk:summary,summary_en:summary,minutes:Number(m[4]),is_free:index===0,is_published:true,materials:{lesson_id:lessonId,video_url:'',body,body_kk:body,body_en:body},tasks};
});
writeFileSync(new URL('../src/data/preIntermediate.ts',import.meta.url),`// Generated from content/pre-intermediate-units-1-3.md.\nimport type { SeedLesson } from './seed';\nexport const preIntermediateLessons: SeedLesson[] = ${JSON.stringify(lessons,null,2)};\n`);
console.log(`Generated ${lessons.length} lessons and ${lessons.reduce((n,l)=>n+l.tasks.length,0)} tasks.`);
