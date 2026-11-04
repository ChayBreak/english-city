import { useState, type FormEvent } from "react";
import { CheckCircle2, ChevronRight, Clock, QrCode, ShieldCheck } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { Link, useLocation } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { errorText } from "../lib/util";
import { Badge, Button, Empty, ErrorState, Field, Loading, Notice } from "../ui";

const PHONE = /^\+?[\d\s()-]{10,18}$/;

export default function Checkout() {
  const { t, tn, pick, price, date } = useI18n();
  const { query } = useLocation();
  const { profile, ready } = useAuth();
  const planId = query.get("plan") ?? "";
  const data = useAsync(async () => {
    const [plans, settings, payments] = await Promise.all([
      backend.listPlans(),
      backend.getPaymentSettings(),
      profile ? backend.listMyPayments(profile.id) : Promise.resolve([]),
    ]);
    return { plan: plans.find((p) => p.id === planId) ?? null, settings, payments };
  }, [planId, profile?.id]);

  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!ready || (data.loading && !data.data)) return <Loading />;
  if (data.error) return <ErrorState error={data.error} onRetry={data.reload} />;

  if (!profile)
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="card stack center">
            <span className="empty-icon">
              <ShieldCheck strokeWidth={1.75} />
            </span>
            <h1 className="h3">{t("checkout.loginTitle")}</h1>
            <p className="muted">{t("checkout.loginFirst")}</p>
            <div className="row" style={{ justifyContent: "center" }}>
              <Button variant="primary" to={`/signup?next=${encodeURIComponent(`/checkout?plan=${planId}`)}`}>
                {t("auth.signup")}
              </Button>
              <Button to={`/login?next=${encodeURIComponent(`/checkout?plan=${planId}`)}`}>{t("nav.login")}</Button>
            </div>
          </div>
        </div>
      </div>
    );

  const { plan, settings, payments } = data.data!;
  if (!plan)
    return (
      <div className="page">
        <Empty title={t("checkout.noPlan")}>
          <Button variant="primary" to="/pricing">
            {t("checkout.choosePlan")}
          </Button>
        </Empty>
      </div>
    );

  if (sent)
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="card stack center" style={{ padding: 40 }}>
            <span className="empty-icon tone-success">
              <CheckCircle2 strokeWidth={1.75} />
            </span>
            <h1 className="h2">{t("checkout.sentTitle")}</h1>
            <p className="lead">{t("checkout.sentText")}</p>
            <Button variant="primary" size="lg" to="/account" arrow>
              {t("checkout.toAccount")}
            </Button>
          </div>
        </div>
      </div>
    );

  const pending = payments.find((payment) => payment.status === "pending");
  const nameError = touched && payerName.trim().length < 2 ? t("checkout.errName") : "";
  const phoneError = touched && !PHONE.test(payerPhone.trim()) ? t("checkout.errPhone") : "";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (payerName.trim().length < 2 || !PHONE.test(payerPhone.trim())) return;
    setBusy(true);
    setError("");
    try {
      await backend.createPaymentRequest({ plan_id: plan.id, payer_name: payerName.trim(), payer_phone: payerPhone.trim() });
      setSent(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: 16 }}>
      <div className="container stack-lg">
        <nav className="breadcrumbs" aria-label={t("nav.breadcrumbs")}>
          <Link to="/pricing">{t("nav.pricing")}</Link>
          <ChevronRight strokeWidth={1.75} />
          <span>{t("checkout.title")}</span>
        </nav>
        <h1 className="h1">{t("checkout.title")}</h1>
        {pending && (
          <Notice tone="warning">
            {t("checkout.pendingExists", { date: date(pending.created_at, true), plan: pending.plan_title })}{" "}
            <Link to="/account">{t("checkout.toAccount")}</Link>
          </Notice>
        )}
        <div className="checkout-grid">
          <div className="pay-steps">
            <section className="card pay-step">
              <div className="pay-step-head">
                <span className="pay-step-num">1</span>
                <h2 className="h4">{t("checkout.step1")}</h2>
              </div>
              <div className="qr-layout">
                <div className="qr-box">
                  {settings.qr_url ? (
                    <img src={settings.qr_url} alt={t("checkout.qrAlt")} />
                  ) : (
                    <div className="qr-empty">
                      <QrCode size={40} strokeWidth={1.5} />
                      {t("checkout.noQr")}
                    </div>
                  )}
                </div>
                <div className="stack">
                  <div className="stack-sm">
                    <span className="caption">{t("checkout.amount")}</span>
                    <span className="summary-total">{price(plan.price)}</span>
                  </div>
                  {settings.recipient && (
                    <div className="kv">
                      <span>{t("checkout.recipient")}</span>
                      <b>{settings.recipient}</b>
                    </div>
                  )}
                  <p className="muted small">{pick(settings, "instructions")}</p>
                  {settings.pay_url && (
                    <div>
                      <a className="btn btn-primary" href={settings.pay_url} target="_blank" rel="noreferrer">
                        {t("checkout.openKaspi")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <form className="card pay-step" onSubmit={submit} noValidate>
              <div className="pay-step-head">
                <span className="pay-step-num">2</span>
                <h2 className="h4">{t("checkout.step2")}</h2>
              </div>
              <div className="form-grid cols-2">
                <Field label={t("checkout.payerName")} hint={t("checkout.payerNameHint")} error={nameError}>
                  {(id) => (
                    <input
                      id={id}
                      className="input"
                      autoComplete="name"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder={profile.full_name || "Аружан С."}
                      required
                    />
                  )}
                </Field>
                <Field label={t("checkout.payerPhone")} hint={t("checkout.payerPhoneHint")} error={phoneError}>
                  {(id) => (
                    <input
                      id={id}
                      className="input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="+7 7__ ___ __ __"
                      required
                    />
                  )}
                </Field>
              </div>
              {error && <Notice tone="danger">{error}</Notice>}
              <div className="row">
                <Button variant="primary" size="lg" type="submit" loading={busy} arrow>
                  {t("checkout.submit")}
                </Button>
                <span className="meta">{t("checkout.submitHint")}</span>
              </div>
            </form>
          </div>

          <aside className="card stack sticky-card">
            <span className="caption">{t("checkout.plan")}</span>
            <div className="row-between">
              <h2 className="h3">{pick(plan, "title")}</h2>
              {plan.featured && <Badge tone="violet">{t("pricing.popular")}</Badge>}
            </div>
            <hr className="divider" />
            <div className="summary-row">
              <span>{t("checkout.term")}</span>
              <b>{tn("unit.day", plan.days)}</b>
            </div>
            {plan.old_price ? (
              <div className="summary-row">
                <span>{t("checkout.oldPrice")}</span>
                <s className="meta">{price(plan.old_price)}</s>
              </div>
            ) : null}
            <div className="summary-row">
              <span>{t("checkout.amount")}</span>
              <b className="num">{price(plan.price)}</b>
            </div>
            <hr className="divider" />
            <p className="meta row">
              <Clock size={16} strokeWidth={1.75} />
              {t("checkout.reviewTime")}
            </p>
            <p className="meta">{t("pricing.extendNote")}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
