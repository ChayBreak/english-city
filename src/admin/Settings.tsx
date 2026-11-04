import { useState, type FormEvent } from "react";
import { ImageUp, QrCode, Trash2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import type { PaymentSettings } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText } from "../lib/util";
import { Button, ErrorState, Field, Loading, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";
import { LocalizedField } from "./CourseEditor";

export default function Settings() {
  const { data, error, loading, reload } = useAsync(() => backend.getPaymentSettings(), []);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return null;
  return <SettingsForm initial={data} />;
}

function SettingsForm({ initial }: { initial: PaymentSettings }) {
  const { t } = useI18n();
  const toast = useToast();
  const [settings, setSettings] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      set("qr_url", await backend.uploadImage(file));
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await backend.savePaymentSettings(settings);
      toast(t("common.saved"));
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHead title={t("admin.settings")} lead={t("admin.set.lead")} />
      <form className="card editor-block" onSubmit={save}>
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
            <p className="muted small">{t("admin.set.qrHint")}</p>
            <div className="row">
              <label className="btn btn-secondary">
                {uploading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <ImageUp size={18} strokeWidth={1.75} />}
                {t("admin.set.upload")}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={(e) => void upload(e.target.files?.[0])} />
              </label>
              {settings.qr_url && (
                <Button type="button" variant="ghost" icon={Trash2} onClick={() => set("qr_url", "")}>
                  {t("common.delete")}
                </Button>
              )}
            </div>
          </div>
        </div>
        <Field label={t("checkout.recipient")} hint={t("admin.set.recipientHint")}>
          {(id) => <input id={id} className="input" value={settings.recipient} onChange={(e) => set("recipient", e.target.value)} />}
        </Field>
        <Field label={t("admin.set.payUrl")} hint={t("admin.set.payUrlHint")}>
          {(id) => <input id={id} className="input" type="url" value={settings.pay_url} onChange={(e) => set("pay_url", e.target.value)} placeholder="https://pay.kaspi.kz/pay/…" />}
        </Field>
        <LocalizedField
          label={t("admin.set.instructions")}
          value={settings.instructions}
          valueKk={settings.instructions_kk}
          valueEn={settings.instructions_en}
          onChange={(v) => set("instructions", v)}
          onChangeKk={(v) => set("instructions_kk", v)}
          onChangeEn={(v) => set("instructions_en", v)}
          multiline
          rows={4}
        />
        <div>
          <Button variant="primary" type="submit" loading={busy}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </>
  );
}
