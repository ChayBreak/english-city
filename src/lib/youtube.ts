/** Pulls the video id and start time out of any common YouTube link. */
export function parseYouTube(input: string): { id: string; start: number } | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return { id: raw, start: 0 };
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id = "";
  if (host === "youtu.be") id = url.pathname.slice(1);
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? "";
    const match = url.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/);
    if (match) id = match[2];
  }
  id = id.slice(0, 11);
  if (!/^[\w-]{11}$/.test(id)) return null;
  return { id, start: parseTime(url.searchParams.get("t") ?? url.searchParams.get("start") ?? "") };
}

function parseTime(value: string) {
  if (/^\d+$/.test(value)) return Number(value);
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

export function embedUrl(input: string) {
  const parsed = parseYouTube(input);
  if (!parsed) return null;
  const params = new URLSearchParams({ rel: "0", modestbranding: "1", cc_lang_pref: "en" });
  if (parsed.start) params.set("start", String(parsed.start));
  return `https://www.youtube-nocookie.com/embed/${parsed.id}?${params}`;
}
