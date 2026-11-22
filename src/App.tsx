import type { ReactNode } from "react";
import { AdminLayout } from "./admin/AdminLayout";
import Courses from "./admin/Courses";
import CourseEditor from "./admin/CourseEditor";
import Dashboard from "./admin/Dashboard";
import LessonEditor from "./admin/LessonEditor";
import LaunchLeads from "./admin/LaunchLeads";
import Payments from "./admin/Payments";
import Plans from "./admin/Plans";
import Reviews from "./admin/Reviews";
import Settings from "./admin/Settings";
import Students from "./admin/Students";
import { SiteLayout } from "./layout";
import { AuthProvider } from "./lib/auth";
import { I18nProvider, useI18n } from "./lib/i18n";
import { matchPath, useLocation } from "./lib/router";
import Account from "./pages/Account";
import AuthPage from "./pages/Auth";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import CoursePage from "./pages/Course";
import Home from "./pages/Home";
import Launch from "./pages/Launch";
import LessonPage from "./pages/Lesson";
import Pricing from "./pages/Pricing";
import { Button, Empty, ToastProvider } from "./ui";

type Route = { path: string; render: (params: Record<string, string>) => ReactNode };

const siteRoutes: Route[] = [
  { path: "/", render: () => <Home /> },
  { path: "/courses", render: () => <Catalog /> },
  { path: "/courses/:slug", render: ({ slug }) => <CoursePage key={slug} slug={slug} /> },
  { path: "/lessons/:id", render: ({ id }) => <LessonPage key={id} id={id} /> },
  { path: "/pricing", render: () => <Pricing /> },
  { path: "/checkout", render: () => <Checkout /> },
  { path: "/account", render: () => <Account /> },
];

const adminRoutes: Route[] = [
  { path: "/admin", render: () => <Dashboard /> },
  { path: "/admin/payments", render: () => <Payments /> },
  { path: "/admin/leads", render: () => <LaunchLeads /> },
  { path: "/admin/reviews", render: () => <Reviews /> },
  { path: "/admin/students", render: () => <Students /> },
  { path: "/admin/courses", render: () => <Courses /> },
  { path: "/admin/courses/:id", render: ({ id }) => <CourseEditor key={id} id={id} /> },
  { path: "/admin/lessons/:id", render: ({ id }) => <LessonEditor key={id} id={id} /> },
  { path: "/admin/plans", render: () => <Plans /> },
  { path: "/admin/settings", render: () => <Settings /> },
];

function resolve(routes: Route[], path: string) {
  for (const route of routes) {
    const params = matchPath(route.path, path);
    if (params) return route.render(params);
  }
  return null;
}

function NotFound() {
  const { t } = useI18n();
  return (
    <div className="page">
      <Empty title={t("common.notFound")}>
        <Button variant="primary" to="/">
          {t("common.toHome")}
        </Button>
      </Empty>
    </div>
  );
}

function Routes() {
  const { path } = useLocation();
  if (path === "/start") return <Launch />;
  // Sign-in is a standalone split screen, as in the design system, without the app frame.
  if (path === "/login" || path === "/signup") return <AuthPage mode={path === "/login" ? "login" : "signup"} />;
  if (path === "/admin" || path.startsWith("/admin/"))
    return <AdminLayout>{resolve(adminRoutes, path) ?? <NotFound />}</AdminLayout>;
  return <SiteLayout>{resolve(siteRoutes, path) ?? <NotFound />}</SiteLayout>;
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
