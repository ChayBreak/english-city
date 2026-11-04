import { useState } from "react";
import { CalendarPlus, Search, ShieldCheck, Users } from "lucide-react";
import { backend } from "../lib/backend";
import { useAuth } from "../lib/auth";
import { useI18n } from "../lib/i18n";
import type { StudentRow } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText, isActive } from "../lib/util";
import { Badge, Button, Empty, ErrorState, Field, Loading, Modal, useToast } from "../ui";
import { AdminHead, useAdmin } from "./AdminLayout";

export default function Students() {
  const { t, date } = useI18n();
  const { refreshStats } = useAdmin();
  const { data, error, loading, reload } = useAsync(() => backend.listStudents(), []);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<StudentRow | null>(null);

  const q = query.trim().toLowerCase();
  const rows = (data ?? []).filter(
    (row) => !q || [row.full_name, row.email, row.phone].some((value) => value.toLowerCase().includes(q)),
  );

  return (
    <>
      <AdminHead title={t("admin.students")} lead={t("admin.stu.lead")} />
      <div className="toolbar">
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
          <Search size={18} strokeWidth={1.75} style={{ position: "absolute", left: 14, top: 13, color: "var(--ink-3)" }} />
          <input
            className="input"
            style={{ paddingLeft: 42, maxWidth: "none" }}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.stu.search")}
            aria-label={t("admin.stu.search")}
          />
        </div>
        {data && <span className="meta">{t("admin.stu.total", { n: rows.length })}</span>}
      </div>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : rows.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t("admin.stu.name")}</th>
                <th>{t("auth.phone")}</th>
                <th>{t("account.sub")}</th>
                <th>{t("admin.stu.lessons")}</th>
                <th>{t("admin.stu.joined")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="person">
                    <b>
                      {row.full_name || "—"} {row.role === "admin" && <Badge tone="violet">admin</Badge>}
                    </b>
                    <span>{row.email}</span>
                  </td>
                  <td className="num">{row.phone || "—"}</td>
                  <td>
                    {isActive(row.access_until) ? (
                      <Badge tone="success">{t("admin.stu.until", { date: date(row.access_until) })}</Badge>
                    ) : row.access_until ? (
                      <Badge tone="neutral">{t("admin.stu.expired", { date: date(row.access_until) })}</Badge>
                    ) : (
                      <span className="meta">{t("account.subNone")}</span>
                    )}
                  </td>
                  <td className="num">{row.completed_lessons}</td>
                  <td className="meta">{date(row.created_at)}</td>
                  <td className="actions">
                    <Button size="sm" icon={CalendarPlus} onClick={() => setSelected(row)}>
                      {t("admin.stu.manage")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <Empty icon={Users} title={t("admin.stu.empty")} />
        </div>
      )}
      <ManageDialog
        student={selected}
        onClose={() => setSelected(null)}
        onDone={() => {
          setSelected(null);
          void reload();
          refreshStats();
        }}
      />
    </>
  );
}

function ManageDialog({ student, onClose, onDone }: { student: StudentRow | null; onClose: () => void; onDone: () => void }) {
  const { t, date } = useI18n();
  const { profile } = useAuth();
  const toast = useToast();
  const [days, setDays] = useState("30");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>, message: string) => {
    setBusy(true);
    try {
      await action();
      toast(message);
      setNote("");
      onDone();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setBusy(false);
    }
  };

  if (!student) return <Modal open={false} onClose={onClose}>{null}</Modal>;
  const active = isActive(student.access_until);
  const isSelf = student.id === profile?.id;

  return (
    <Modal open onClose={onClose}>
      <div className="stack-sm">
        <h2 className="h3">{student.full_name || student.email}</h2>
        <span className="meta">
          {student.email} · {active ? t("admin.stu.until", { date: date(student.access_until) }) : t("account.subNone")}
        </span>
      </div>
      <div className="form-grid cols-2">
        <Field label={t("admin.stu.days")}>
          {(id) => (
            <input id={id} className="input num" type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
          )}
        </Field>
        <Field label={t("admin.stu.note")}>
          {(id) => <input id={id} className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("admin.stu.notePlaceholder")} />}
        </Field>
      </div>
      <div className="row">
        <Button
          variant="primary"
          icon={CalendarPlus}
          loading={busy}
          disabled={!(Number(days) > 0)}
          onClick={() => void run(() => backend.grantAccess(student.id, Math.round(Number(days)), note.trim()), t("admin.stu.granted"))}
        >
          {active ? t("admin.stu.extend") : t("admin.stu.grant")}
        </Button>
        {active && (
          <Button
            variant="danger"
            disabled={busy}
            onClick={() => {
              if (window.confirm(t("admin.stu.revokeConfirm"))) void run(() => backend.revokeAccess(student.id), t("admin.stu.revoked"));
            }}
          >
            {t("admin.stu.revoke")}
          </Button>
        )}
      </div>
      <hr className="divider" />
      <div className="row-between">
        <span className="meta">{student.role === "admin" ? t("admin.stu.isAdmin") : t("admin.stu.isStudent")}</span>
        {!isSelf && (
          <Button
            size="sm"
            variant="ghost"
            icon={ShieldCheck}
            disabled={busy}
            onClick={() => {
              const role = student.role === "admin" ? "student" : "admin";
              if (window.confirm(role === "admin" ? t("admin.stu.makeAdminConfirm") : t("admin.stu.removeAdminConfirm")))
                void run(() => backend.setRole(student.id, role), t("common.saved"));
            }}
          >
            {student.role === "admin" ? t("admin.stu.removeAdmin") : t("admin.stu.makeAdmin")}
          </Button>
        )}
      </div>
      <div className="modal-actions">
        <Button variant="ghost" onClick={onClose}>
          {t("common.close")}
        </Button>
      </div>
    </Modal>
  );
}
