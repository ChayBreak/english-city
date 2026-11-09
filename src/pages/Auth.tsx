import { useEffect, useState, type FormEvent } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { backend } from "../lib/backend";
import type { DemoBackend } from "../lib/demoBackend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { navigate, useLocation } from "../lib/router";
import { errorText } from "../lib/util";
import { signupPasswordIsValid } from "../lib/password";
import { DemoBar, LocaleSwitch } from "../layout";
import { Button, Field, Logo, Notice, SPARK } from "../ui";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { t } = useI18n();
  const { query } = useLocation();
  const { profile, ready } = useAuth();
  const next = query.get("next")?.startsWith("/") ? query.get("next")! : "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (ready && profile) navigate(profile.role === "admin" && next === "/account" ? "/admin" : next, { replace: true });
  }, [ready, profile, next]);

  const friendly = (err: unknown) => {
    const text = errorText(err);
    if (/invalid login/i.test(text)) return t("auth.errInvalid");
    if (/already registered|already exists/i.test(text)) return t("auth.errExists");
    if (/email not confirmed/i.test(text)) return t("auth.errConfirm");
    return text;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      if (mode === "login") await backend.signIn(email.trim(), password);
      else {
        if (!signupPasswordIsValid(password)) throw new Error(t("auth.passwordHint"));
        const needsConfirm = await backend.signUp({ email: email.trim(), password, full_name: "", phone: "" });
        if (needsConfirm) setInfo(t("auth.confirmEmail", { email: email.trim() }));
      }
    } catch (err) {
      setError(friendly(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    try {
      await backend.signInWithGoogle();
    } catch (err) {
      setError(friendly(err));
    }
  };

  const switchTo = (value: "login" | "signup") => {
    setError("");
    setInfo("");
    navigate(`/${value}${window.location.search}`, { replace: true });
  };

  return (
    <div className="auth-page">
      <DemoBar />
      <div className="auth-layout">
        <section className="auth-aside" aria-label="English City">
          <svg className="auth-art" viewBox="0 0 600 800" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
            <rect className="tile" x="300" y="420" width="140" height="140" rx="20" />
            <rect className="tile" x="456" y="420" width="140" height="140" rx="20" />
            <rect className="tile" x="300" y="576" width="140" height="140" rx="20" />
            <rect className="tile" x="456" y="576" width="140" height="140" rx="20" />
            <path className="spark" transform="translate(380 470) scale(5)" d={SPARK} opacity={0.9} />
            <path className="spark" transform="translate(330 400) scale(1.8)" d={SPARK} opacity={0.4} />
          </svg>
          <Logo />
          <div className="auth-aside-copy">
            <span className="eyebrow">{t("home.overline")}</span>
            <h1 className="hero-title">
              {t("auth.asideBefore")}
              <span lang="en">step by step</span>
            </h1>
            <p>{t("auth.lead")}</p>
          </div>
        </section>

        <section className="auth-main">
          <div className="auth-form">
            <div className="auth-locale">
              <LocaleSwitch />
            </div>
            <div className="stack-sm">
              <h2 className="page-title">{mode === "login" ? t("auth.welcome") : t("auth.create")}</h2>
              <p className="meta">{mode === "login" ? t("auth.loginLead") : t("auth.signupLead")}</p>
            </div>

            <form className="stack" onSubmit={submit}>
              <Field label="Email">
                {(id) => (
                  <input
                    id={id}
                    className="input"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                )}
              </Field>
              <Field label={t("auth.password")} hint={mode === "signup" ? t("auth.passwordHint") : undefined}>
                {(id) => (
                  <input
                    id={id}
                    className="input"
                    type="password"
                    required
                    minLength={mode === "signup" ? 4 : undefined}
                    maxLength={mode === "signup" ? 8 : undefined}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
              </Field>
              {error && <Notice tone="danger">{error}</Notice>}
              {info && <Notice tone="success">{info}</Notice>}
              <Button variant="primary" size="lg" block type="submit" loading={busy}>
                {mode === "login" ? t("auth.submitLogin") : t("auth.submitSignup")}
              </Button>
            </form>

            <div className="or-line">{t("auth.or")}</div>
            <Button variant="secondary" size="lg" block onClick={() => void google()} type="button">
              <GoogleMark />
              {t("auth.google")}
            </Button>

            <p className="auth-switch">
              {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
              <button type="button" className="link-btn" onClick={() => switchTo(mode === "login" ? "signup" : "login")}>
                {mode === "login" ? t("auth.signup") : t("auth.login")}
              </button>
            </p>

            {backend.mode === "demo" && <DemoLogin />}
          </div>
        </section>
      </div>
    </div>
  );
}

function DemoLogin() {
  const { t } = useI18n();
  const demo = backend as DemoBackend;
  return (
    <div className="sunken stack-sm">
      <b className="small">{t("auth.demo")}</b>
      <span className="meta">{t("auth.demoHint")}</span>
      <div className="row">
        <Button size="sm" icon={GraduationCap} onClick={() => void demo.demoSignIn("student")}>
          {t("auth.demoStudent")}
        </Button>
        <Button size="sm" icon={ShieldCheck} onClick={() => void demo.demoSignIn("admin")}>
          {t("auth.demoAdmin")}
        </Button>
      </div>
    </div>
  );
}
