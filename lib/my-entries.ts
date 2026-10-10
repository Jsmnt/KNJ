// Remembers, in this browser only, which entries this visitor submitted,
// together with the secret token that allows removing them.

export type MyEntry = { id: string; token: string };

const STORAGE_KEY = "knj-my-entries";

export function loadMyEntries(): MyEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((e) => typeof e?.id === "string" && typeof e?.token === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveMyEntries(entries: MyEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Private browsing or storage blocked: the page still works, just without "Remove".
  }
}
