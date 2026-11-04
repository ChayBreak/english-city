import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Key } from "./dict";
import type { Locale } from "./types";

const STORAGE_KEY = "ec-locale";
const NBSP = String.fromCharCode(0xa0);
const KK_MONTHS = ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"];

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "kk" || saved === "en") return saved;
  } catch {
    /* default below */
  }
  // English is only ever an explicit choice: many local browsers are set to English.
  return typeof navigator !== "undefined" && navigator.language?.startsWith("kk") ? "kk" : "ru";
}

type Vars = Record<string, string | number>;

const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`)) : text;

function pluralIndex(n: number, locale: Locale) {
  if (locale === "en") return n === 1 ? 0 : 1;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 0;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 1;
  return 2;
}

function useI18nValue() {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not persisted */
    }
  }, []);

  return useMemo(() => {
    const dict = dictionaries[locale];
    const t = (key: Key, vars?: Vars) => fill(dict[key] ?? dictionaries.ru[key] ?? key, vars);
    /** "урок|урока|уроков" / "lesson|lessons" style keys: picks the form for n and prefixes the number. */
    const tn = (key: Key, n: number) => {
      const forms = (dict[key] ?? dictionaries.ru[key]).split("|");
      const form = forms.length > 1 ? forms[pluralIndex(n, locale)] : forms[0];
      return `${n}${NBSP}${form}`;
    };
    /** Content field in the current language (`title_kk`, `title_en`), falling back to Russian. */
    const pick = <T extends object>(item: T, field: keyof T & string) => {
      const record = item as Record<string, unknown>;
      const local = locale === "ru" ? undefined : record[`${field}_${locale}`];
      return String(typeof local === "string" && local.trim() ? local : record[field] ?? "");
    };
    const date = (iso: string | null | undefined, withTime = false) => {
      if (!iso) return "";
      const value = new Date(iso);
      const time = withTime
        ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ru-RU", { hour: "2-digit", minute: "2-digit" }).format(value)
        : "";
      // Browsers often lack Kazakh month names in Intl, so they're spelled out here.
      if (locale === "kk")
        return `${value.getDate()} ${KK_MONTHS[value.getMonth()]} ${value.getFullYear()} ж.${time ? `, ${time}` : ""}`;
      const day = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(value);
      return time ? `${day}, ${time}` : day;
    };
    const price = (amount: number) => `${new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU").format(amount)}${NBSP}₸`;
    return { locale, setLocale, t, tn, pick, date, price };
  }, [locale, setLocale]);
}

type I18n = ReturnType<typeof useI18nValue>;
const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const value = useI18nValue();
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n outside I18nProvider");
  return value;
}
