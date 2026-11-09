import { useState } from "react";
import { Plus, Tags, Trash2 } from "lucide-react";
import { backend } from "../lib/backend";
import { useI18n } from "../lib/i18n";
import type { Plan } from "../lib/types";
import { useAsync } from "../lib/useAsync";
import { errorText, newId } from "../lib/util";
import { Badge, Button, Empty, ErrorState, Field, Loading, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";
import { LocalizedField } from "./CourseEditor";

export default function Plans() {
  const { t } = useI18n();
  const toast = useToast();
  const { data, error, loading, reload } = useAsync(() => backend.listPlans(true), []);

  const add = async () => {
    try {
      await backend.savePlan({
        id: newId(),
        title: t("admin.plan.newTitle"),
        title_kk: "",
        title_en: "",
        description: "",
        description_kk: "",
        description_en: "",
        days: 30,
        price: 7700,
        old_price: null,
        featured: false,
        is_active: false,
        sort: (data?.at(-1)?.sort ?? 0) + 1,
      });
      await reload();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  return (
    <>
      <AdminHead title={t("admin.plans")} lead={t("admin.plan.lead")}>
        <Button variant="primary" icon={Plus} onClick={() => void add()}>
          {t("admin.plan.add")}
        </Button>
      </AdminHead>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : data?.length ? (
        <div className="stack">
          {data.map((plan) => (
            <PlanEditor key={plan.id} plan={plan} onChanged={reload} />
          ))}
        </div>
      ) : (
        <div className="card">
          <Empty icon={Tags} title={t("pricing.empty")} />
        </div>
      )}
    </>
  );
}

function PlanEditor({ plan: initial, onChanged }: { plan: Plan; onChanged: () => void }) {
  const { t } = useI18n();
  const toast = useToast();
  const [plan, setPlan] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Plan>(key: K, value: Plan[K]) => setPlan({ ...plan, [key]: value });

  const save = async () => {
    setBusy(true);
    try {
      await backend.savePlan(plan);
      toast(t("common.saved"));
      onChanged();
    } catch (err) {
      toast(errorText(err), true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t("admin.plan.deleteConfirm"))) return;
    try {
      await backend.deletePlan(plan.id);
      onChanged();
    } catch (err) {
      toast(errorText(err), true);
    }
  };

  return (
    <article className="card editor-block">
      <div className="row-between">
        <h2 className="h4">{plan.title}</h2>
        {plan.is_active ? <Badge tone="success">{t("admin.plan.active")}</Badge> : <Badge tone="neutral">{t("admin.plan.hidden")}</Badge>}
      </div>
      <div className="form-grid cols-2">
        <LocalizedField
          label={t("admin.crs.title")}
          value={plan.title}
          valueKk={plan.title_kk}
          valueEn={plan.title_en}
          onChange={(v) => set("title", v)}
          onChangeKk={(v) => set("title_kk", v)}
          onChangeEn={(v) => set("title_en", v)}
        />
        <LocalizedField
          label={t("admin.crs.description")}
          value={plan.description}
          valueKk={plan.description_kk}
          valueEn={plan.description_en}
          onChange={(v) => set("description", v)}
          onChangeKk={(v) => set("description_kk", v)}
          onChangeEn={(v) => set("description_en", v)}
        />
      </div>
      <div className="form-grid cols-3">
        <Field label={t("admin.plan.days")}>
          {(id) => <input id={id} className="input num" type="number" min={1} value={plan.days} onChange={(e) => set("days", Number(e.target.value))} />}
        </Field>
        <Field label={t("admin.plan.price")}>
          {(id) => <input id={id} className="input num" type="number" min={0} value={plan.price} onChange={(e) => set("price", Number(e.target.value))} />}
        </Field>
        <Field label={t("admin.plan.oldPrice")} hint={t("admin.plan.oldPriceHint")}>
          {(id) => (
            <input
              id={id}
              className="input num"
              type="number"
              min={0}
              value={plan.old_price ?? ""}
              onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) : null)}
            />
          )}
        </Field>
        <Field label={t("admin.crs.sort")}>
          {(id) => <input id={id} className="input num" type="number" value={plan.sort} onChange={(e) => set("sort", Number(e.target.value))} />}
        </Field>
      </div>
      <div className="row" style={{ gap: 24 }}>
        <label className="check">
          <input type="checkbox" checked={plan.is_active} onChange={(e) => set("is_active", e.target.checked)} />
          {t("admin.plan.showOnSite")}
        </label>
        <label className="check">
          <input type="checkbox" checked={plan.featured} onChange={(e) => set("featured", e.target.checked)} />
          {t("admin.plan.featured")}
        </label>
      </div>
      <div className="row">
        <Button variant="primary" loading={busy} onClick={() => void save()}>
          {t("common.save")}
        </Button>
        <span className="spacer" />
        <Button variant="danger" size="sm" icon={Trash2} onClick={() => void remove()}>
          {t("common.delete")}
        </Button>
      </div>
    </article>
  );
}
