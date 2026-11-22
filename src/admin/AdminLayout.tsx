import { createContext, useContext, type ReactNode } from "react";
import { BookOpen, ClipboardCheck, CreditCard, ExternalLink, LayoutDashboard, LogOut, MessageCircle, QrCode, Tags, Users } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import { launchCopy } from "../lib/launchCopy";
import { useLocation } from "../lib/router";
import { useAsync } from "../lib/useAsync";
import { AppShell, signOut, type NavSection } from "../layout";
import { Button, Empty, Loading } from "../ui";
import type { AdminStats } from "../lib/types";

type AdminContext = { stats: AdminStats | undefined; refreshStats: () => void };
const Context = createContext<AdminContext>({ stats: undefined, refreshStats: () => undefined });
export const useAdmin = () => useContext(Context);

export function AdminLayout({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const { ready, profile, isAdmin } = useAuth();
  const { path } = useLocation();
  const stats = useAsync(() => (isAdmin ? backend.adminStats() : Promise.resolve(undefined)), [isAdmin, path]);

  if (!ready) return <Loading />;
  if (!profile || !isAdmin)
    return (
      <div className="page">
        <Empty title={t("admin.forbidden")}>
          <Button variant="primary" to={profile ? "/" : "/login?next=/admin"}>
            {profile ? t("common.toHome") : t("nav.login")}
          </Button>
        </Empty>
      </div>
    );

  const sections: NavSection[] = [
    {
      label: t("nav.admin"),
      items: [
        { to: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard, exact: true },
        { to: "/admin/payments", label: t("admin.payments"), icon: CreditCard, count: stats.data?.pendingPayments },
        { to: "/admin/leads", label: launchCopy[locale].admin, icon: MessageCircle },
        { to: "/admin/reviews", label: t("admin.reviews"), icon: ClipboardCheck, count: stats.data?.pendingReviews },
        { to: "/admin/students", label: t("admin.students"), icon: Users },
        { to: "/admin/courses", label: t("admin.courses"), icon: BookOpen },
        { to: "/admin/plans", label: t("admin.plans"), icon: Tags },
        { to: "/admin/settings", label: t("admin.settings"), icon: QrCode },
      ],
    },
    {
      label: t("nav.accountSection"),
      foot: true,
      items: [
        { to: "/", label: t("admin.toSite"), icon: ExternalLink, exact: true },
        { label: t("nav.logout"), icon: LogOut, danger: true, onClick: () => void signOut() },
      ],
    },
  ];

  return (
    <Context.Provider value={{ stats: stats.data, refreshStats: () => void stats.reload() }}>
      <AppShell home="/admin" sections={sections}>
        <div className="admin-main">{children}</div>
      </AppShell>
    </Context.Provider>
  );
}

export function AdminHead({ title, lead, children }: { title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <div className="admin-head">
      <div>
        <h1 className="h2">{title}</h1>
        {lead && <p className="muted">{lead}</p>}
      </div>
      {children && <div className="row">{children}</div>}
    </div>
  );
}
