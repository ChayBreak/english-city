import { BookOpen, ClipboardCheck, CreditCard, Users } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import { Link } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { Button, Empty, Loading } from "../ui";
import { AdminHead, useAdmin } from "./AdminLayout";

export default function Dashboard() {
  const { t, date, price } = useI18n();
  const { stats } = useAdmin();
  const payments = useAsync(() => backend.listPayments("pending"), []);
  const reviews = useAsync(() => backend.listSubmissions("submitted"), []);

  const tiles = [
    { to: "/admin/payments", icon: CreditCard, tone: "warning", value: stats?.pendingPayments, label: t("admin.stat.payments") },
    { to: "/admin/reviews", icon: ClipboardCheck, tone: "pink", value: stats?.pendingReviews, label: t("admin.stat.reviews") },
    { to: "/admin/students", icon: Users, tone: "success", value: stats?.activeStudents, label: t("admin.stat.active") },
    { to: "/admin/courses", icon: BookOpen, tone: "violet", value: stats?.publishedCourses, label: t("admin.stat.courses") },
  ];

  return (
    <>
      <AdminHead title={t("admin.dashboard")} lead={t("admin.dashboardLead")} />
      <div className="stack-lg">
        <div className="stat-grid">
          {tiles.map((tile) => (
            <Link key={tile.to} to={tile.to} className="stat">
              <span className={`stat-icon tone-${tile.tone}`}>
                <tile.icon strokeWidth={1.75} />
              </span>
              <div>
                <div className="stat-value">{tile.value ?? "—"}</div>
                <div className="stat-label">{tile.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="form-grid cols-2" style={{ alignItems: "start" }}>
          <section className="card stack">
            <div className="row-between">
              <h2 className="h4">{t("admin.pay.waiting")}</h2>
              <Button size="sm" variant="soft" to="/admin/payments">
                {t("admin.openAll")}
              </Button>
            </div>
            {payments.loading && !payments.data ? (
              <Loading />
            ) : payments.data?.length ? (
              <div className="list">
                {payments.data.slice(0, 5).map((payment) => (
                  <div className="list-row" key={payment.id}>
                    <div className="list-row-main">
                      <b>{payment.student?.full_name || payment.student?.email}</b>
                      <span className="meta">
                        {payment.plan_title} · {price(payment.amount)} · {date(payment.created_at, true)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={CreditCard} title={t("admin.pay.empty")} />
            )}
          </section>
          <section className="card stack">
            <div className="row-between">
              <h2 className="h4">{t("admin.rev.waiting")}</h2>
              <Button size="sm" variant="soft" to="/admin/reviews">
                {t("admin.openAll")}
              </Button>
            </div>
            {reviews.loading && !reviews.data ? (
              <Loading />
            ) : reviews.data?.length ? (
              <div className="list">
                {reviews.data.slice(0, 5).map((submission) => (
                  <div className="list-row" key={submission.id}>
                    <div className="list-row-main">
                      <b>{submission.student?.full_name || submission.student?.email}</b>
                      <span className="meta">
                        {t(`task.kind.${submission.kind}`)} · {submission.lesson?.title} · {date(submission.updated_at, true)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty icon={ClipboardCheck} title={t("admin.rev.empty")} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
