import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Info,
  Mic,
  PenLine,
  PlayCircle,
  Trophy,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { courseCoverUrl } from "./lib/courseCovers";
import { Link } from "./lib/router";
import { useI18n } from "./lib/i18n";
import type { Category, CourseSummary, Plan } from "./lib/types";
import { errorText } from "./lib/util";

/** violet, pink and sky are the system's category tones; the rest are statuses. */
export type Tone = "violet" | "pink" | "sky" | "success" | "warning" | "danger";

export const CATEGORY_META: Record<Category, { label: string; tone: Tone; icon: LucideIcon }> = {
  general: { label: "General English", tone: "sky", icon: BookOpen },
  speaking: { label: "Speaking", tone: "violet", icon: Mic },
  grammar: { label: "Grammar", tone: "pink", icon: PenLine },
  ielts: { label: "IELTS", tone: "pink", icon: Trophy },
  business: { label: "Business English", tone: "sky", icon: Briefcase },
};

export const SPARK = "M12 3c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8z";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="logo" aria-label="English City">
      <img className="logo-mark" src="/logo-mark.png" alt="" width={40} height={40} />
      <span lang="en">
        English<span className="logo-accent">City</span>
      </span>
    </Link>
  );
}

/** The system's banner art: four outlined tiles and two sparkles on the right. */
export function BannerArt({ className = "banner-art" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 240" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <rect className="tile" x="480" y="-20" width="150" height="150" rx="18" />
      <rect className="tile" x="640" y="-20" width="150" height="150" rx="18" />
      <rect className="tile" x="480" y="140" width="150" height="150" rx="18" />
      <rect className="tile" x="640" y="140" width="150" height="150" rx="18" />
      <path className="spark" transform="translate(640 56) scale(3.2)" d={SPARK} opacity={0.9} />
      <path className="spark" transform="translate(600 6) scale(1.4)" d={SPARK} opacity={0.35} />
    </svg>
  );
}

const AVATAR_TONES: Tone[] = ["violet", "pink", "sky"];

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const tone = AVATAR_TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_TONES.length];
  return (
    <span className={`avatar tone-${tone}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }} aria-hidden="true">
      {initials || "?"}
    </span>
  );
}

export function StatTile({ icon: Icon, tone = "violet", label, value, to }: { icon: LucideIcon; tone?: Tone; label: ReactNode; value: ReactNode; to?: string }) {
  const body = (
    <>
      <span className={`stat-icon tone-${tone}`}>
        <Icon strokeWidth={1.75} />
      </span>
      <span className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </span>
    </>
  );
  return to ? (
    <Link to={to} className="stat">
      {body}
    </Link>
  ) : (
    <div className="stat">{body}</div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "secondary" | "soft" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  arrow?: boolean;
  glow?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  to?: string;
};

export function Button({
  variant = "secondary",
  size = "md",
  block,
  arrow,
  glow,
  loading,
  icon: Icon,
  to,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    block && "btn-block",
    glow && "btn-glow",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : Icon && <Icon strokeWidth={1.75} />}
      {children}
      {arrow && (
        <span className="btn-chip">
          <ArrowRight strokeWidth={2} />
        </span>
      )}
    </>
  );
  if (to)
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  ghost,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: LucideIcon; label: string; size?: "sm" | "md"; ghost?: boolean }) {
  return (
    <button
      type="button"
      className={["icon-btn", size === "sm" && "icon-btn-sm", ghost && "icon-btn-ghost", className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon strokeWidth={1.75} />
    </button>
  );
}

export function Badge({
  tone = "neutral",
  icon: Icon,
  children,
}: {
  tone?: Tone | "neutral" | "solid";
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {Icon && <Icon strokeWidth={2} />}
      {children}
    </span>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  children: (id: string) => ReactElement;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`field ${error ? "field-error" : ""} ${className}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children(id)}
      {(error || hint) && <span className="field-hint">{error || hint}</span>}
    </div>
  );
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: { id: T; label: ReactNode; count?: number }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          className="tab"
          aria-selected={item.id === value}
          onClick={() => onChange(item.id)}
        >
          {item.label}
          {item.count ? <span className="count">{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ value, max = 100, label, valueText }: { value: number; max?: number; label?: ReactNode; valueText?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress">
      {(label || valueText) && (
        <div className="progress-head">
          <span>{label}</span>
          <b>{valueText ?? `${pct}%`}</b>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "success" | "warning" | "danger"; children: ReactNode }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? TriangleAlert : tone === "danger" ? AlertCircle : Info;
  return (
    <div className={`notice notice-${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <Icon strokeWidth={1.75} />
      <div>{children}</div>
    </div>
  );
}

export function Loading() {
  const { t } = useI18n();
  return (
    <div className="loading" role="status">
      <span className="spinner" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="empty">
      <span className="empty-icon">
        <AlertCircle strokeWidth={1.75} />
      </span>
      <b>{t("common.error")}</b>
      <span className="meta">{errorText(error)}</span>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}

export function Empty({ icon: Icon = BookOpen, title, children }: { icon?: LucideIcon; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon strokeWidth={1.75} />
      </span>
      <b>{title}</b>
      {children}
    </div>
  );
}

export function CourseCover({ course, className = "course-media" }: { course: Pick<CourseSummary, "cover_url" | "category" | "slug">; className?: string }) {
  const meta = CATEGORY_META[course.category];
  const cover = courseCoverUrl(course);
  return (
    <div className={`${className} tone-${meta.tone}`}>
      {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : <meta.icon strokeWidth={1.75} aria-hidden="true" />}
    </div>
  );
}

export function CourseCard({ course }: { course: CourseSummary }) {
  const { t, tn, pick } = useI18n();
  const meta = CATEGORY_META[course.category];
  return (
    <Link to={`/courses/${course.slug}`} className="course-card">
      <div className="course-media-wrap">
        <CourseCover course={course} />
        <span className="course-level">{course.level}</span>
      </div>
      <Badge tone={meta.tone} icon={meta.icon}>
        {meta.label}
      </Badge>
      <h3 className="course-title" lang="en">
        {pick(course, "title")}
      </h3>
      <p className="course-sub">{pick(course, "subtitle")}</p>
      <div className="course-meta">
        <span>
          <PlayCircle strokeWidth={1.75} />
          {tn("unit.lesson", course.lesson_count)}
        </span>
        <span>
          <Clock strokeWidth={1.75} />
          {t("common.minutes", { n: course.minutes })}
        </span>
      </div>
    </Link>
  );
}

export function PlanCard({ plan, onSelect, cta }: { plan: Plan; onSelect: () => void; cta: string }) {
  const { t, tn, pick, price } = useI18n();
  return (
    <article className={`plan ${plan.featured ? "plan-featured" : ""}`}>
      <div>
        <div className="plan-name">
          <h3 className="h4">{pick(plan, "title")}</h3>
          {plan.featured && <Badge tone="solid">{t("pricing.popular")}</Badge>}
        </div>
        {pick(plan, "description") && <p className="plan-desc">{pick(plan, "description")}</p>}
      </div>
      <div className="stack-sm">
        <div className="plan-price">
          <span className="plan-amount">{price(plan.price)}</span>
          {plan.old_price ? <span className="plan-old">{price(plan.old_price)}</span> : null}
        </div>
        <span className="plan-period">{t("pricing.access", { days: tn("unit.day", plan.days) })}</span>
      </div>
      <ul className="check-list">
        {(["pricing.f1", "pricing.f2", "pricing.f3", "pricing.f4"] as const).map((key) => (
          <li key={key}>
            <CheckCircle2 strokeWidth={1.75} />
            {t(key)}
          </li>
        ))}
      </ul>
      <Button variant="primary" block size="lg" onClick={onSelect} arrow>
        {cta}
      </Button>
    </article>
  );
}

/* ---------- toasts ---------- */
type Toast = { id: number; text: string; error?: boolean };
const ToastContext = createContext<(text: string, error?: boolean) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, error = false) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, text, error }]);
    window.setTimeout(() => setToasts((list) => list.filter((toast) => toast.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.error ? "error" : ""}`}>
            {toast.error ? <AlertCircle strokeWidth={2} /> : <CheckCircle2 strokeWidth={2} />}
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ---------- modal ---------- */
export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);
  return (
    <dialog ref={ref} className="modal" onClose={onClose} onCancel={onClose}>
      {open && <div className="modal-body">{children}</div>}
    </dialog>
  );
}
