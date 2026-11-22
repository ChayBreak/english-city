import { BookOpen, CheckCircle2, Gift, Mic, PlayCircle, QrCode, Trophy, Volume2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { launchCopy } from "../lib/launchCopy";
import { Link, navigate } from "../lib/router";
import { LEVELS } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { Badge, BannerArt, Button, CourseCard, PlanCard, StatTile } from "../ui";

export default function Home() {
  const { t, locale } = useI18n();
  const courses = useAsync(() => backend.listCourses(), []);
  const plans = useAsync(() => backend.listPlans(), []);

  const list = courses.data ?? [];
  const levels = LEVELS.filter((level) => list.some((course) => course.level === level));
  const levelRange = levels.length > 1 ? `${levels[0]}–${levels[levels.length - 1]}` : (levels[0] ?? "—");

  return (
    <div className="page stack-lg">
      <section className="hero-banner">
        <BannerArt />
        <span className="eyebrow">{t("home.overline")}</span>
        <h1 className="hero-title">
          {t("home.titleBefore")}
          <span lang="en">fluently</span>
          {t("home.titleAfter")}
        </h1>
        <p className="hero-lead">{t("home.lead")}</p>
        <Button variant="dark" arrow to="/courses">
          {t("home.ctaCourses")}
        </Button>
        <Link className="pill-chip" to="/start"><Gift size={17} />{launchCopy[locale].offer}</Link>
        <div className="hero-points">
          <span>
            <CheckCircle2 strokeWidth={1.75} />
            {t("home.point1")}
          </span>
          <span>
            <CheckCircle2 strokeWidth={1.75} />
            {t("home.point2")}
          </span>
        </div>
      </section>

      {courses.data && (
        <div className="stat-grid">
          <StatTile icon={BookOpen} tone="violet" label={t("home.stat.courses")} value={list.length} to="/courses" />
          <StatTile
            icon={PlayCircle}
            tone="pink"
            label={t("home.stat.lessons")}
            value={list.reduce((sum, course) => sum + course.lesson_count, 0)}
          />
          <StatTile icon={Trophy} tone="sky" label={t("home.stat.levels")} value={levelRange} />
        </div>
      )}

      <section className="stack">
        <div className="section-head">
          <h2 className="section-title">{t("home.catalogTitle")}</h2>
          <Link to="/courses" className="see-all">
            {t("home.catalogAll")}
          </Link>
        </div>
        {courses.data && (
          <div className="panel grid-courses">
            {list.slice(0, 4).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="stack">
        <div className="section-head">
          <h2 className="section-title">{t("home.how")}</h2>
        </div>
        <div className="steps-grid">
          {[
            { icon: PlayCircle, tone: "violet", title: t("home.step1.t"), text: t("home.step1.d") },
            { icon: QrCode, tone: "sky", title: t("home.step2.t"), text: t("home.step2.d") },
            { icon: Mic, tone: "pink", title: t("home.step3.t"), text: t("home.step3.d") },
          ].map((step, index) => (
            <div className="card step" key={step.title}>
              <div className="row-between">
                <span className={`plaque tone-${step.tone}`}>
                  <step.icon strokeWidth={1.75} />
                </span>
                <span className="step-num">0{index + 1}</span>
              </div>
              <h3 className="tile-title">{step.title}</h3>
              <p className="muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-split">
        <div className="card stack-lg">
          <div className="stack">
            <span className="eyebrow">{t("home.speakerOverline")}</span>
            <h2 className="section-title">{t("home.speakerTitle")}</h2>
            <p className="muted">{t("home.speakerText")}</p>
          </div>
          <ul className="check-list">
            {(["home.speaker.f1", "home.speaker.f2", "home.speaker.f3"] as const).map((key) => (
              <li key={key}>
                <CheckCircle2 strokeWidth={1.75} />
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="feedback">
            <div className="feedback-head">
              <Badge tone="success">{t("task.status.reviewed")}</Badge>
              <span className="num">85 / 100</span>
              <span className="meta">{t("home.reviewCardTitle")}</span>
            </div>
            <p>{t("home.reviewCardText")}</p>
          </div>
        </div>
        <SpeakerDemo />
      </section>

      {plans.data && plans.data.length > 0 && (
        <section className="stack">
          <div className="section-head">
            <div className="stack-sm">
              <h2 className="section-title">{t("home.pricingTitle")}</h2>
              <p className="muted">{t("pricing.lead")}</p>
            </div>
          </div>
          <div className="plans-grid">
            {plans.data.map((plan) => (
              <PlanCard key={plan.id} plan={plan} cta={t("pricing.choose")} onSelect={() => navigate(`/checkout?plan=${plan.id}`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpeakerDemo() {
  const { t } = useI18n();
  return (
    <div className="card speaker-demo" aria-hidden="true">
      <div className="row-between">
        <Badge tone="violet" icon={Mic}>
          Speaking · A2
        </Badge>
        <span className="caption">2 / 3</span>
      </div>
      <p className="phrase-text" lang="en">
        <span className="word word-ok">I</span> <span className="word word-ok">think</span>{" "}
        <span className="word word-miss">three</span> <span className="word word-ok">is</span>{" "}
        <span className="word word-ok">enough.</span>
      </p>
      <div className="speaker-chart">
        <div className="speaker-wave">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} className={i % 5 === 2 ? "hi" : ""} style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.12}s` }} />
          ))}
        </div>
      </div>
      <div className="row">
        <span className="pill-chip">
          <Volume2 size={16} strokeWidth={1.75} />
          {t("pron.listen")}
        </span>
        <span className="pill-chip">
          <span className="rec-dot" />
          {t("home.demoRecording")}
        </span>
      </div>
      <div className="result-line">
        <Badge tone="success">{t("pron.score", { n: 80 })}</Badge>
        <span>{t("home.demoHint")}</span>
      </div>
    </div>
  );
}
