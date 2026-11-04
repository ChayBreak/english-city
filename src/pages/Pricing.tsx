import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { navigate } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { Empty, ErrorState, Loading, Notice, PlanCard } from "../ui";

export default function Pricing() {
  const { t, date } = useI18n();
  const { hasAccess, accessUntil, isAdmin } = useAuth();
  const { data, error, loading, reload } = useAsync(() => backend.listPlans(), []);

  return (
    <div className="page">
      <div className="container stack-lg">
        <div className="stack">
          <span className="overline">{t("nav.pricing")}</span>
          <h1 className="h1">{t("home.pricingTitle")}</h1>
          <p className="lead">{t("pricing.lead")}</p>
        </div>
        {hasAccess && !isAdmin && <Notice tone="success">{t("pricing.activeNote", { date: date(accessUntil) })}</Notice>}
        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : data?.length ? (
          <div className="plans-grid">
            {data.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cta={hasAccess ? t("pricing.extend") : t("pricing.choose")}
                onSelect={() => navigate(`/checkout?plan=${plan.id}`)}
              />
            ))}
          </div>
        ) : (
          <Empty title={t("pricing.empty")} />
        )}
        <div className="card card-flat stack-sm">
          <h2 className="h4">{t("pricing.howTitle")}</h2>
          <p className="muted">{t("pricing.howText")}</p>
        </div>
      </div>
    </div>
  );
}
