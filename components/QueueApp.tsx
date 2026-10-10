"use client";

import { useCallback, useEffect, useState } from "react";
import type { Submission } from "@/lib/types";
import { normalizeUrl } from "@/lib/utils";
import { loadMyEntries, saveMyEntries, type MyEntry } from "@/lib/my-entries";
import SubmitForm from "./SubmitForm";
import HowItWorks from "./HowItWorks";
import QueueList from "./QueueList";

const REFRESH_EVERY_MS = 10_000;

// Loads the shared queue from the server, keeps it fresh, and connects
// the form, the "You're #N" banner and the queue list.
export default function QueueApp() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mine, setMine] = useState<MyEntry[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: { items: Submission[] } = await res.json();
      setItems(data.items);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // On first load: remember this visitor's entries, fetch the queue,
  // then refresh every 10 seconds and whenever the tab comes back into view.
  useEffect(() => {
    const first = setTimeout(() => {
      setMine(loadMyEntries());
      refresh();
    }, 0);
    const timer = setInterval(refresh, REFRESH_EVERY_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const queue = items
    .filter((i) => i.status === "queue")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const done = items
    .filter((i) => i.status === "done")
    .sort((a, b) => (b.checkedAt ?? "").localeCompare(a.checkedAt ?? ""));

  const mineIds = new Set(mine.map((m) => m.id));
  // The banner follows this visitor's most recent link that is still waiting.
  const latestId = [...mine].reverse().find((m) => queue.some((q) => q.id === m.id))?.id ?? null;
  const latestIndex = queue.findIndex((i) => i.id === latestId);

  async function handleSubmit(rawUrl: string, name: string): Promise<string | null> {
    // Quick check in the browser for instant feedback; the server checks again.
    if (!rawUrl.trim()) return "Paste a link first.";
    if (!normalizeUrl(rawUrl)) return "That doesn't look like a website link.";

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl, name }),
      });
      const data = await res.json();
      if (!res.ok) return data.error ?? "Something went wrong. Please try again.";

      const entry: MyEntry = { id: data.item.id, token: data.ownerToken };
      const nextMine = [...loadMyEntries(), entry];
      saveMyEntries(nextMine);
      setMine(nextMine);
      setItems((prev) => [...prev, data.item]);
      return null;
    } catch {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  }

  async function handleRemove(id: string) {
    const entry = mine.find((m) => m.id === id);
    if (!entry) return;
    if (!window.confirm("Remove your link from the queue?")) return;

    const res = await fetch(`/api/submissions/${id}`, {
      method: "DELETE",
      headers: { "x-owner-token": entry.token },
    }).catch(() => null);

    if (res && (res.ok || res.status === 404)) {
      const nextMine = loadMyEntries().filter((m) => m.id !== id);
      saveMyEntries(nextMine);
      setMine(nextMine);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      window.alert("Couldn't remove it right now. Please try again.");
    }
  }

  const ahead =
    latestIndex === 0 ? "Nobody is" : latestIndex === 1 ? "1 site is" : `${latestIndex} sites are`;

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16 sm:pt-20">
        <p className="mb-3.5 font-mono text-[13px] uppercase tracking-widest text-muted">
          Website review queue · {loading ? "…" : queue.length} waiting now
        </p>
        <h1 className="max-w-[14ch] font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          Paste your link. Get in line.
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg text-ink/80 sm:text-[19px]">
          Drop your website below and you&apos;ll get a spot in the queue right away. Watch it move — once it&apos;s been
          checked, it lands in Done.
        </p>

        <SubmitForm onSubmit={handleSubmit} />

        {latestIndex >= 0 && (
          <div role="status" className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl bg-ink px-6 py-5 text-white">
            <span className="font-display text-[44px] font-bold leading-none">#{latestIndex + 1}</span>
            <div className="flex-[1_1_260px]">
              <div className="text-[17px] font-semibold">You&apos;re in line!</div>
              <div className="text-[15px] text-[#C9CCD3]">
                {ahead} ahead of you. Your row is highlighted below — you can close this page and come back.
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a href="#queue" className="rounded-[10px] border border-[#5A5F6B] px-4 py-2.5 font-medium hover:bg-white/10">
                See my spot
              </a>
              <button
                type="button"
                onClick={() => latestId && handleRemove(latestId)}
                className="cursor-pointer rounded-[10px] bg-white px-4 py-2.5 font-semibold text-[#A3330B] hover:bg-[#FDF3EC]"
              >
                Leave queue
              </button>
            </div>
          </div>
        )}
      </section>

      <HowItWorks />

      <QueueList
        queue={queue}
        done={done}
        mineIds={mineIds}
        onRemove={handleRemove}
        loading={loading}
        loadError={loadError}
      />
    </>
  );
}
