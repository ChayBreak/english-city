import { useRef, useState, type FormEvent } from "react";
import { BookOpen, Check, ChevronDown, CirclePlay, Copy, Gift, Headphones, MessageCircle, Mic, Sparkles } from "lucide-react";
import "@fontsource-variable/golos-text";
import { ELEMENTARY_A2_SLUG } from "../data/elementaryA2";
import { backend } from "../lib/backend";
import { courseCoverUrl, landingHeroPhoto, landingHeroPhotoSmall } from "../lib/courseCovers";
import { useI18n } from "../lib/i18n";
import { DISCOUNT_PER_FRIEND, firstMonthPrice, inviteCodePattern, MAX_FRIENDS, MONTHLY_PRICE, normalizeWhatsApp, submitLaunchLead } from "../lib/launch";
import { launchCopy } from "../lib/launchCopy";
import { Link, useLocation } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import "../styles/launch.css";

const sampleCourse = "everyday-english-b1";
const otherSampleCourses = ["first-steps-a1", ELEMENTARY_A2_SLUG, "clear-pronunciation-a2", "business-english-b2"];

export default function Launch() {
  const { locale, setLocale, price, pick } = useI18n();
  const copy = launchCopy[locale];
  const { query } = useLocation();
  const invite = query.get("ref");
  const course = useAsync(() => backend.getCourse(sampleCourse), []);
  const trials = useAsync(async () => {
    const results = await Promise.allSettled(otherSampleCourses.map((slug) => backend.getCourse(slug)));
    return results.flatMap((result) => {
      if (result.status !== "fulfilled" || !result.value?.course.is_published) return [];
      const lesson = result.value.lessons.find((item) => item.is_free);
      return lesson ? [{ course: result.value.course, lesson }] : [];
    });
  }, []);
  const freeLesson = course.data?.lessons.find((lesson) => lesson.is_free);
  const sampleUrl = freeLesson ? `/lessons/${freeLesson.id}` : `/courses/${sampleCourse}`;
  const sampleCover = courseCoverUrl(course.data?.course ?? { slug: sampleCourse, cover_url: "" });
  const continueInCurrentLanguage = () => setLocale(locale);
  const [friends, setFriends] = useState(MAX_FRIENDS);
  const referral = invite && inviteCodePattern.test(invite) ? invite.toLowerCase() : null;
  const featureIcons = [CirclePlay, Mic, MessageCircle];

  return (
    <div className="launch">
      <header className="launch-header">
        <div className="launch-inner launch-bar">
          <a className="launch-logo" href="#top"><img src="/logo-mark.png" alt="" />English City</a>
          <nav className="launch-nav">
            <a href="#lessons">{copy.navCourse}</a>
            <a href="#friends">{copy.navOffer}</a>
          </nav>
          <div className="launch-header-actions">
            <select aria-label="Language" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
              <option value="ru">RU</option><option value="kk">KZ</option><option value="en">EN</option>
            </select>
            <Link to="/login">{copy.login}</Link>
          </div>
        </div>
      </header>
      <main id="top" className="launch-inner">
        <section className="launch-hero">
          <div className="launch-pitch">
            <p className="launch-kicker"><Sparkles size={15} />{copy.eyebrow}</p>
            <h1>{copy.title[0]} <em>{copy.title[1]}</em></h1>
            <p className="launch-lead">{copy.intro}</p>
            <a className="launch-offer" href="#friends">
              <Gift size={21} />
              {copy.offerAction}
            </a>
            <p className="launch-base">{copy.base} <strong>{price(MONTHLY_PRICE)}</strong></p>
            <a className="launch-button launch-hero-cta" href="#join">{copy.back}</a>
            <img className="launch-hero-photo" src={landingHeroPhoto}
              srcSet={`${landingHeroPhotoSmall} 768w, ${landingHeroPhoto} 1440w`}
              sizes="(max-width: 600px) calc(100vw - 30px), 660px"
              alt="" width={1440} height={630} fetchPriority="high" />
          </div>
          <LeadForm key={invite ?? ""} referral={referral} />
        </section>
        <section className="launch-method" id="lessons">
          <div className="launch-lesson">
            {sampleCover && <img className="launch-lesson-image" src={sampleCover} alt="" width={1440} height={960} loading="lazy" decoding="async" />}
            <div className="launch-lesson-top"><span><BookOpen size={18} />{copy.lessonLabel}</span><span lang="en">A2 → B1</span></div>
            <h2>{copy.lessonTitle}</h2>
            <div className="launch-lesson-card">
              <span><Headphones size={17} />{copy.lessonTag}</span>
              <p lang="en">“What do you usually do on weekends?”</p>
              <small>{copy.lessonPrompt}</small>
            </div>
            <Link className="launch-sample" to={sampleUrl} onClick={continueInCurrentLanguage}><CirclePlay size={19} />{copy.sample}</Link>
          </div>
          <div className="launch-method-copy">
            <h2>{copy.methodTitle}</h2>
            <p>{copy.methodIntro}</p>
            <ul>
              {copy.features.map(([title, detail], i) => {
                const Icon = featureIcons[i];
                return <li key={title}><span className="launch-feature-icon"><Icon size={23} /></span><div><h3>{title}</h3><p>{detail}</p></div></li>;
              })}
            </ul>
          </div>
        </section>
        {Boolean(trials.data?.length) && <section className="launch-trials" aria-labelledby="more-free-lessons">
          <h2 id="more-free-lessons">{copy.moreTrials}</h2>
          <div className="launch-trial-grid">
            {trials.data?.map(({ course: trialCourse, lesson }) => {
              const cover = courseCoverUrl(trialCourse);
              return (
                <Link className="launch-trial" to={`/lessons/${lesson.id}`} key={lesson.id} onClick={continueInCurrentLanguage}>
                  {cover && <img src={cover} alt="" width={1440} height={960} loading="lazy" decoding="async" />}
                  <span className="launch-trial-caption"><span className="launch-trial-level">{trialCourse.level}</span><strong>{pick(lesson, "title")}</strong></span>
                </Link>
              );
            })}
          </div>
        </section>}
        <section className="launch-referral" id="friends" aria-labelledby="launch-referral-title">
          <div>
            <p className="launch-kicker"><Gift size={17} />{copy.navOffer}</p>
            <h2 id="launch-referral-title">{copy.referralTitle}</h2>
            <p>{copy.referralIntro}</p>
            <ol>{copy.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            <a href="#join" className="launch-button launch-button-light">{copy.back}</a>
          </div>
          <div className="launch-calculator">
            <fieldset>
              <legend>{copy.friendLabel}</legend>
              <div className="launch-options">
                {Array.from({ length: MAX_FRIENDS + 1 }, (_, amount) => (
                  <label key={amount}><input type="radio" name="friends" checked={friends === amount} onChange={() => setFriends(amount)} /><span>{amount}</span></label>
                ))}
              </div>
            </fieldset>
            <div aria-live="polite" className="launch-calc-result">
              <p>{copy.firstMonth}</p>
              <strong>{price(firstMonthPrice(friends))}</strong>
              {friends > 0 && <span>{friends * DISCOUNT_PER_FRIEND}% {copy.off}</span>}
            </div>
            <small>{copy.terms}</small>
          </div>
        </section>
        <section className="launch-faq">
          <h2>{copy.faqTitle}</h2>
          <div>{copy.faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div>
        </section>
      </main>
      <footer className="launch-inner launch-footer"><a className="launch-logo" href="#top"><img src="/logo-mark.png" alt="" />English City</a><Link to={sampleUrl} onClick={continueInCurrentLanguage}>{copy.sample}</Link></footer>
    </div>
  );
}

function LeadForm({ referral }: { referral: string | null }) {
  const { locale } = useI18n();
  const copy = launchCopy[locale];
  const demo = backend.mode === "demo";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"error" | "duplicate" | "badInvite" | "invalid" | null>(null);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [ignoreReferral, setIgnoreReferral] = useState(false);
  const attempt = useRef<{ phone: string; code: string } | null>(null);
  const linkInput = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const phone = normalizeWhatsApp(String(fields.get("whatsapp") ?? ""));
    if (!phone) { setError("invalid"); return; }

    setBusy(true);
    setError(null);
    try {
      if (attempt.current?.phone !== phone) attempt.current = { phone, code: crypto.randomUUID() };
      const { code } = attempt.current;
      const result = await submitLaunchLead(phone, locale, ignoreReferral ? null : referral, code);
      if (result !== "created") { setError(result); return; }
      const url = new URL("/start", window.location.origin);
      url.searchParams.set("ref", code);
      setLink(url.toString());
    } catch {
      setError("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="launch-form" id="join" aria-labelledby="launch-form-title">
      <span className="launch-form-icon"><MessageCircle size={26} /></span>
      <h2 id="launch-form-title">{link ? copy.saved : copy.formTitle}</h2>
      {link ? (
        <div className="launch-success" role="status">
          <p>{demo ? copy.demoSaved : copy.savedText}</p>
          {!demo && <>
            <input ref={linkInput} aria-label={copy.inviteLabel} value={link} readOnly onFocus={(event) => event.target.select()} />
            <a className="launch-button" href={`https://wa.me/?text=${encodeURIComponent(copy.shareText + " " + link)}`} target="_blank" rel="noreferrer"><MessageCircle size={20} />{copy.share}</a>
            <button type="button" className="launch-copy" onClick={async () => {
              try { await navigator.clipboard.writeText(link); setCopied(true); }
              catch { linkInput.current?.focus(); }
            }}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? copy.copied : copy.copy}</button>
          </>}
        </div>
      ) : (
        <>
          {referral && !ignoreReferral && error !== "badInvite" && <p className="launch-invited"><Gift size={16} />{copy.invited}</p>}
          <form onSubmit={(event) => void handleSubmit(event)}>
            <label className="launch-phone">{copy.phone}<input type="tel" name="whatsapp" autoComplete="tel" dir="ltr" placeholder="+7 701 234 56 78" aria-describedby="launch-contact-notice" required maxLength={35} /></label>
            {error && <p className="launch-error" role="alert">{copy[error]}</p>}
            {error === "badInvite" && <button type="button" className="launch-copy" onClick={() => { setIgnoreReferral(true); setError(null); }}>{copy.withoutInvite}</button>}
            <button className="launch-button" type="submit" disabled={busy}><MessageCircle size={20} />{busy ? copy.sending : copy.submit}</button>
          </form>
          <p className="launch-contact-notice" id="launch-contact-notice">{demo ? copy.demo : copy.contactNotice}</p>
        </>
      )}
    </section>
  );
}
