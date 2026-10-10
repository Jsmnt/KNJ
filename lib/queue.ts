import type { Submission } from "./types";

// The columns that are safe to show to everyone.
// owner_token is deliberately NOT in this list — it must never leave the server
// except once, to the person who created the entry.
export const PUBLIC_COLUMNS = "id, name, url, status, created_at, checked_at";

export type SubmissionRow = {
  id: string;
  name: string;
  url: string;
  status: "queue" | "done";
  created_at: string;
  checked_at: string | null;
};

// Database row (snake_case) -> what the page uses (camelCase).
export function toSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    status: row.status,
    createdAt: row.created_at,
    checkedAt: row.checked_at ?? undefined,
  };
}

// Cleans the optional name: trims, removes invisible characters, max 40 letters.
export function cleanName(input: unknown): string {
  if (typeof input !== "string") return "Anonymous";
  const name = input.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 40);
  return name || "Anonymous";
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
