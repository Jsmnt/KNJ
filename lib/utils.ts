// Turns what the user typed into a clean link, or null if it isn't a website.
export function normalizeUrl(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = "https://" + value;

  try {
    const url = new URL(value);
    const isWeb = url.protocol === "http:" || url.protocol === "https:";
    const hasDot = url.hostname.includes(".");
    if (!isWeb || !hasDot) return null;
    return url.toString();
  } catch {
    return null;
  }
}

// "https://www.Site.com/page" -> "site.com". Two links with the same key are the same website.
export function siteKey(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url.toLowerCase();
  }
}

// "https://site.com/" -> "site.com"
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// "5 min ago", "2 hr ago", "3 days ago"
export function timeAgo(iso: string | undefined, now: number | null): string {
  if (!iso || now === null) return "";
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
