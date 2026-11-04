import { useState, type FormEvent, type ReactNode } from "react";
import { BookOpen, House, LogIn, LogOut, Menu, Search, ShieldCheck, Tags, UserRound, X, type LucideIcon } from "lucide-react";
import { backend } from "./lib/backend";
import { resetDemo } from "./lib/demoBackend";
import { useAuth } from "./lib/auth";
import { useI18n } from "./lib/i18n";
import { Link, navigate, useLocation } from "./lib/router";
import { Avatar, Button, IconButton, Logo } from "./ui";

export function LocaleSwitch() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="seg" role="group" aria-label={t("lang.label")}>
      <button type="button" aria-pressed={locale === "ru"} onClick={() => setLocale("ru")}>
        RU
      </button>
      <button type="button" aria-pressed={locale === "kk"} onClick={() => setLocale("kk")}>
        KZ
      </button>
      <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>
        EN
      </button>
    </div>
  );
}

export function DemoBar() {
  const { t } = useI18n();
  if (backend.mode !== "demo") return null;
  return (
    <div className="demo-bar">
      <span>{t("demo.banner")}</span>
      <button
        type="button"
        onClick={() => {
          resetDemo();
          window.location.assign("/");
        }}
      >
        {t("demo.reset")}
      </button>
    </div>
  );
}

export async function signOut() {
  await backend.signOut();
  navigate("/");
}

export type NavItem = {
  to?: string;
  label: string;
  icon: LucideIcon;
  /** Only the exact path counts as current (for section roots like "/admin"). */
  exact?: boolean;
  count?: number;
  danger?: boolean;
  onClick?: () => void;
};
export type NavSection = { label?: string; items: NavItem[]; foot?: boolean };

function NavLink({ item, path }: { item: NavItem; path: string }) {
  const content = (
    <>
      <item.icon strokeWidth={1.75} />
      <span>{item.label}</span>
      {item.count ? <span className="count">{item.count}</span> : null}
    </>
  );
  const className = `nav-item ${item.danger ? "is-danger" : ""}`;
  if (!item.to)
    return (
      <button type="button" className={className} onClick={item.onClick}>
        {content}
      </button>
    );
  const to = item.to;
  const current = item.exact ? path === to : path === to || path.startsWith(`${to}/`);
  return (
    <Link to={to} className={className} aria-current={current ? "page" : undefined}>
      {content}
    </Link>
  );
}

function SearchField() {
  const { t } = useI18n();
  const { path, query } = useLocation();
  const [value, setValue] = useState(() => (path === "/courses" ? query.get("q") ?? "" : ""));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
  };
  return (
    <form className="search" role="search" onSubmit={submit}>
      <Search strokeWidth={1.75} aria-hidden="true" />
      <input type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder={t("nav.search")} aria-label={t("nav.searchLabel")} />
    </form>
  );
}

/** The system's app frame: white sidebar on the left, top bar and content on the light background. */
export function AppShell({
  home,
  sections,
  aside,
  search,
  children,
}: {
  home: string;
  sections: NavSection[];
  aside?: ReactNode;
  search?: boolean;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const { profile } = useAuth();
  const { path } = useLocation();
  // The drawer belongs to the page it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === path;
  const main = sections.filter((section) => !section.foot);
  const foot = sections.filter((section) => section.foot);

  return (
    <div className="app">
      <aside className={`sidebar ${menu ? "open" : ""}`} aria-label={t("nav.main")}>
        <div className="sidebar-head">
          <Logo to={home} />
          <IconButton className="sidebar-close" icon={X} label={t("common.close")} ghost onClick={() => setMenuPath(null)} />
        </div>
        {main.map((section, index) => (
          <nav className="nav" key={index} aria-label={section.label ?? t("nav.main")}>
            {section.label && <div className="nav-label">{section.label}</div>}
            {section.items.map((item) => (
              <NavLink key={item.label} item={item} path={path} />
            ))}
          </nav>
        ))}
        {aside}
        {foot.map((section, index) => (
          <nav className="nav sidebar-foot" key={index} aria-label={section.label ?? t("nav.accountSection")}>
            {section.label && <div className="nav-label">{section.label}</div>}
            {section.items.map((item) => (
              <NavLink key={item.label} item={item} path={path} />
            ))}
          </nav>
        ))}
      </aside>
      {menu && <button type="button" className="sidebar-scrim" aria-label={t("common.close")} onClick={() => setMenuPath(null)} />}

      <div className="app-main">
        <DemoBar />
        <header className="topbar">
          <IconButton className="menu-toggle" icon={Menu} label={t("nav.menu")} aria-expanded={menu} onClick={() => setMenuPath(path)} />
          <span className="topbar-logo">
            <Logo to={home} />
          </span>
          {search ? <SearchField key={path} /> : <span className="spacer" />}
          <div className="topbar-actions">
            <LocaleSwitch />
            <span className="topbar-divider" aria-hidden="true" />
            {profile ? (
              <Link to="/account" className="user-chip" aria-label={t("nav.account")}>
                <Avatar name={profile.full_name || profile.email} />
                <span className="user-chip-name">{profile.full_name || profile.email}</span>
              </Link>
            ) : (
              <Button variant="primary" size="sm" to="/login" icon={LogIn}>
                {t("nav.login")}
              </Button>
            )}
          </div>
        </header>
        <main id="main" className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, date } = useI18n();
  const { profile, isAdmin, hasAccess, accessUntil } = useAuth();

  const sections: NavSection[] = [
    {
      label: t("nav.learn"),
      items: [
        { to: "/", label: t("nav.home"), icon: House, exact: true },
        { to: "/courses", label: t("nav.courses"), icon: BookOpen },
        { to: "/pricing", label: t("nav.pricing"), icon: Tags },
        ...(profile ? [{ to: "/account", label: t("nav.account"), icon: UserRound }] : []),
        ...(isAdmin ? [{ to: "/admin", label: t("nav.admin"), icon: ShieldCheck }] : []),
      ],
    },
    {
      label: t("nav.accountSection"),
      foot: true,
      items: profile
        ? [{ label: t("nav.logout"), icon: LogOut, danger: true, onClick: () => void signOut() }]
        : [{ to: "/login", label: t("nav.login"), icon: LogIn }],
    },
  ];

  const aside = isAdmin ? null : hasAccess ? (
    <div className="sidebar-card">
      <b>{t("account.sub")}</b>
      <span>{t("sidebar.access", { date: date(accessUntil) })}</span>
    </div>
  ) : (
    <div className="sidebar-card">
      <b>{t("sidebar.promo")}</b>
      <span>{t("home.point1")}</span>
      <Button variant="primary" size="sm" to="/pricing">
        {t("nav.pricing")}
      </Button>
    </div>
  );

  return (
    <AppShell home="/" sections={sections} aside={aside} search>
      {children}
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} English City</span>
        <nav aria-label={t("nav.footer")}>
          <Link to="/courses">{t("nav.courses")}</Link>
          <Link to="/pricing">{t("nav.pricing")}</Link>
          <Link to={profile ? "/account" : "/login"}>{t("nav.account")}</Link>
        </nav>
      </footer>
    </AppShell>
  );
}
