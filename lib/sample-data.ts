import type { Submission } from "./types";

// Temporary fake entries so the page has something to show.
// In Module 4 these come from the database instead.
export const sampleItems: Submission[] = [
  { id: "1", name: "Ana Reyes", url: "https://anareyes.dev", status: "queue", createdAt: "2026-10-10T10:40:00Z" },
  { id: "2", name: "Paolo Cruz", url: "https://paolocruz.vercel.app", status: "queue", createdAt: "2026-10-10T10:46:00Z" },
  { id: "3", name: "Studio Lim", url: "https://studiolim.co", status: "queue", createdAt: "2026-10-10T10:51:00Z" },
  { id: "4", name: "Kim Uy", url: "https://kimuy.me", status: "done", createdAt: "2026-10-10T09:30:00Z", checkedAt: "2026-10-10T10:30:00Z" },
];
