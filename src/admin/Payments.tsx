import { useState } from "react";
import { Check, CreditCard, X } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import type { PaymentRequest, PaymentStatus } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText } from "../lib/util";
import { Badge, Button, Empty, ErrorState, Field, Loading, Modal, Tabs, useToast } from "../ui";
import { AdminHead, useAdmin } from "./AdminLayout";

const TONE = { pending: "warning", approved: "success", rejected: "danger" } as const;

export default function Payments() {
  const { t } = useI18n();
  const { stats, refreshStats } = useAdmin();
  const [status, setStatus] = useState<PaymentStatus | "all">("pending");
  const { data, error, loading, reload } = useAsync(() => backend.listPayments(status), [status]);
  const [rejecting, setRejecting] = useState<PaymentRequest | null>(null);

  const done = () => {
    void reload();
    refreshStats();
  };

  return (
    <>
      <AdminHead title={t("admin.payments")} lead={t("admin.pay.lead")} />
      <div className="toolbar">
        <Tabs
          label={t("admin.filter")}
          value={status}
          onChange={setStatus}
          items={[
            { id: "pending", label: t("payment.status.pending"), count: stats?.pendingPayments },
            { id: "approved", label: t("payment.status.approved") },
            { id: "rejected", label: t("payment.status.rejected") },
            { id: "all", label: t("admin.all") },
          ]}
        />
      </div>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data?.length ? (
        <div className="stack">
          {data.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} onDone={done} onReject={() => setRejecting(payment)} />
          ))}
        </div>
      ) : (
        <div className="card">
          <Empty icon={CreditCard} title={t("admin.pay.empty")} />
        </div>
      )}
      <RejectDialog payment={rejecting} onClose={() => setRejecting(null)} onDone={done} />
    </>
  );
}

function PaymentCard({ payment, onDone, onReject }: { payment: PaymentRequest; onDone: () => void; onReject: () => void }) {
  const { t, tn, date, price } = useI18n();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const approve = async () => {
    setBusy(true);
    try {
      await backend.approvePayment(payment.id);
      toast(t("admin.pay.approvedToast", { name: payment.student?.full_name || payment.payer_name }));
      onDone();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="card request-card">
      <div className="row-between">
        <div className="stack-sm">
          <b className="h4">{payment.student?.full_name || payment.student?.email || "—"}</b>
          <span className="meta">
            {payment.student?.email} · {date(payment.created_at, true)}
          </span>
        </div>
        <Badge tone={TONE[payment.status]}>{t(`payment.status.${payment.status}`)}</Badge>
      </div>
      <div className="request-grid sunken">
        <div className="kv">
          <span>{t("admin.pay.amount")}</span>
          <b className="num">{price(payment.amount)}</b>
        </div>
        <div className="kv">
          <span>{t("checkout.plan")}</span>
          <b>
            {payment.plan_title} · {tn("unit.day", payment.days)}
          </b>
        </div>
        <div className="kv">
          <span>{t("admin.pay.payer")}</span>
          <b>{payment.payer_name}</b>
        </div>
        <div className="kv">
          <span>{t("admin.pay.payerPhone")}</span>
          <b>
            <a href={`tel:${payment.payer_phone.replace(/[^\d+]/g, "")}`}>{payment.payer_phone}</a>
          </b>
        </div>
      </div>
      {payment.status === "pending" ? (
        <div className="row">
          <Button variant="success" icon={Check} loading={busy} onClick={() => void approve()}>
            {t("admin.pay.approve")}
          </Button>
          <Button variant="danger" icon={X} disabled={busy} onClick={onReject}>
            {t("admin.pay.reject")}
          </Button>
          <span className="meta">{t("admin.pay.hint")}</span>
        </div>
      ) : (
        <span className="meta">
          {t("admin.pay.reviewedAt", { date: date(payment.reviewed_at, true) })}
          {payment.admin_note && ` · ${payment.admin_note}`}
        </span>
      )}
    </article>
  );
}

function RejectDialog({ payment, onClose, onDone }: { payment: PaymentRequest | null; onClose: () => void; onDone: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const reject = async () => {
    if (!payment) return;
    setBusy(true);
    try {
      await backend.rejectPayment(payment.id, note.trim());
      toast(t("admin.pay.rejectedToast"));
      setNote("");
      onClose();
      onDone();
    } catch (error) {
      toast(errorText(error), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={Boolean(payment)} onClose={onClose}>
      <h2 className="h3">{t("admin.pay.rejectTitle")}</h2>
      <p className="muted">{t("admin.pay.rejectText")}</p>
      <Field label={t("admin.pay.rejectReason")}>
        {(id) => (
          <textarea
            id={id}
            className="input"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("admin.pay.rejectPlaceholder")}
          />
        )}
      </Field>
      <div className="modal-actions">
        <Button variant="ghost" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button variant="danger" loading={busy} onClick={() => void reject()}>
          {t("admin.pay.reject")}
        </Button>
      </div>
    </Modal>
  );
}
