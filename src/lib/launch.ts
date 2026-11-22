import { supabase } from "./supabase";

export const MONTHLY_PRICE = 7700;
export const MAX_FRIENDS = 4;
export const DISCOUNT_PER_FRIEND = 20;
export const firstMonthPrice = (friends: number) =>
  MONTHLY_PRICE * (100 - Math.min(MAX_FRIENDS, friends) * DISCOUNT_PER_FRIEND) / 100;

export const inviteCodePattern = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;

export function normalizeWhatsApp(value: string) {
  const compact = value.trim().replace(/[\s().-]/g, "");
  const number = /^8\d{10}$/.test(compact)
    ? "+7" + compact.slice(1)
    : /^[67]\d{9}$/.test(compact) ? "+7" + compact
    : compact.startsWith("+") ? compact : "+" + compact;
  return /^\+[1-9]\d{7,14}$/.test(number) ? number : null;
}

export async function submitLaunchLead(phone: string, locale: string, invite: string | null, code: string) {
  if (!supabase) return "created";
  const { data, error } = await supabase.rpc("submit_launch_lead", {
    whatsapp_number: phone, language: locale, friend_code: invite, new_code: code,
  });
  if (error) throw error;
  return data as "created" | "duplicate" | "badInvite";
}

export type LaunchLead = {
  code: string;
  whatsapp: string;
  locale: string;
  created_at: string;
  paid_at: string | null;
  qualifying_friends: number;
  discount_friends: number;
};

export const LEADS_PER_PAGE = 30;

export async function listLaunchLeads(page: number) {
  if (!supabase) return [];
  const offset = page * LEADS_PER_PAGE;
  const { data, error } = await supabase.from("launch_lead_summary")
    .select("code,whatsapp,locale,created_at,paid_at,qualifying_friends,discount_friends")
    .order("created_at", { ascending: false })
    .order("code")
    .range(offset, offset + LEADS_PER_PAGE);
  if (error) throw error;
  return data as LaunchLead[];
}

export async function recordLaunchPayment(code: string, receipt: string, discountFriends: number) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.rpc("record_launch_payment", {
    lead_code: code, transaction_reference: receipt, qualifying_discount: discountFriends,
  });
  if (error) throw error;
}
