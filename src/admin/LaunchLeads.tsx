import { useState, type FormEvent } from "react";
import { useI18n } from "../lib/i18n";
import { DISCOUNT_PER_FRIEND, firstMonthPrice, LEADS_PER_PAGE, listLaunchLeads, MAX_FRIENDS, recordLaunchPayment, type LaunchLead } from "../lib/launch";
import { launchCopy } from "../lib/launchCopy";
import { isSupabaseConfigured } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { Button, ErrorState, Loading, Notice, useToast } from "../ui";
import { AdminHead } from "./AdminLayout";

export default function LaunchLeads() {
  const { locale } = useI18n();
  const copy = launchCopy[locale];
  const [page, setPage] = useState(0);
  const leads = useAsync(() => listLaunchLeads(page), [page]);

  return (
    <div className="stack">
      <AdminHead title={copy.admin} lead={copy.adminHelp} />
      {!isSupabaseConfigured ? <Notice>{copy.adminDemo}</Notice>
        : leads.loading ? <Loading />
        : leads.error ? <ErrorState error={leads.error} onRetry={leads.reload} />
        : <>
          {leads.data?.length ? leads.data.slice(0, LEADS_PER_PAGE).map((lead) =>
            <LeadCard key={lead.code} lead={lead} reload={leads.reload} />,
          ) : <Notice>{copy.empty}</Notice>}
          <div className="row">
            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>{copy.prev}</Button>
            <Button disabled={(leads.data?.length ?? 0) <= LEADS_PER_PAGE} onClick={() => setPage(page + 1)}>{copy.next}</Button>
          </div>
        </>}
    </div>
  );
}

function LeadCard({ lead, reload }: { lead: LaunchLead; reload: () => Promise<void> }) {
  const { locale, price, date } = useI18n();
  const toast = useToast();
  const copy = launchCopy[locale];
  const [saving, setSaving] = useState(false);
  const friends = lead.paid_at ? lead.discount_friends : Math.min(MAX_FRIENDS, lead.qualifying_friends);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const receipt = String(fields.get("receipt") ?? "").trim();
    const agreedDiscount = Number(fields.get("discount"));
    if (!receipt || saving) return;
    setSaving(true);
    try {
      await recordLaunchPayment(lead.code, receipt, agreedDiscount);
      toast(copy.posted);
      await reload();
    } catch {
      toast(copy.paymentError, true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="card stack-sm">
      <div className="row-between">
        <strong dir="ltr">{lead.whatsapp}</strong>
        <a href={`https://wa.me/${lead.whatsapp.slice(1)}`} className="text-link" target="_blank" rel="noreferrer">{copy.openChat}</a>
      </div>
      <p className="muted">{copy.received} · {date(lead.created_at, true)} · {lead.locale.toUpperCase()}</p>
      <p>{lead.paid_at ? copy.used : copy.adminOff} · {friends * DISCOUNT_PER_FRIEND}% · {copy.firstMonth} {price(firstMonthPrice(friends))}</p>
      {lead.paid_at ? <p>{copy.verified} · {date(lead.paid_at, true)}</p> : (
        <form className="stack-sm" onSubmit={(event) => void verify(event)}>
          <label className="stack-sm">{copy.receipt}<input className="input" name="receipt" maxLength={100} required disabled={saving} /></label>
          <label className="stack-sm">{copy.used}
            <select className="input" name="discount" defaultValue={friends} disabled={saving}>
              {Array.from({ length: friends + 1 }, (_, count) => (
                <option value={count} key={count}>{count * DISCOUNT_PER_FRIEND}% · {price(firstMonthPrice(count))}</option>
              ))}
            </select>
          </label>
          <div className="row"><Button type="submit" variant="secondary" loading={saving}>{copy.verify}</Button></div>
        </form>
      )}
    </article>
  );
}
