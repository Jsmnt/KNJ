"use client";

import { useState } from "react";
import type { Submission } from "@/lib/types";
import { normalizeUrl, siteKey } from "@/lib/utils";
import SubmitForm from "./SubmitForm";
import HowItWorks from "./HowItWorks";
import QueueList from "./QueueList";

// Holds the list of links and connects the form, the "You're #N" banner and the queue.
// For now everything lives in the browser only; Module 4 saves it to a database.
export default function QueueApp({ initialItems }: { initialItems: Submission[] }) {
  const [items, setItems] = useState<Submission[]>(initialItems);
  const [mineId, setMineId] = useState<string | null>(null);

  const queue = items
    .filter((i) => i.status === "queue")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const done = items
    .filter((i) => i.status === "done")
    .sort((a, b) => (b.checkedAt ?? "").localeCompare(a.checkedAt ?? ""));
  const myIndex = queue.findIndex((i) => i.id === mineId);

  function handleSubmit(rawUrl: string, name: string): string | null {
    if (!rawUrl.trim()) return "Paste a link first.";
    const url = normalizeUrl(rawUrl);
    if (!url) return "That doesn't look like a website link.";

    const duplicate = items.find((i) => siteKey(i.url) === siteKey(url));
    if (duplicate) {
      return duplicate.status === "done"
        ? "This website has already been checked."
        : "This website is already in the queue.";
    }

    const item: Submission = {
      id: crypto.randomUUID(),
      name: name.trim() || "Anonymous",
      url,
      status: "queue",
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, item]);
    setMineId(item.id);
    return null;
  }

  function handleRemoveMine() {
    setItems((prev) => prev.filter((i) => i.id !== mineId));
    setMineId(null);
  }

  const ahead = myIndex === 0 ? "Nobody is" : myIndex === 1 ? "1 site is" : `${myIndex} sites are`;

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16 sm:pt-20">
        <p className="mb-3.5 font-mono text-[13px] uppercase tracking-widest text-muted">
          Website review queue · {queue.length} waiting now
        </p>
        <h1 className="max-w-[14ch] font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          Paste your link. Get in line.
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg text-ink/80 sm:text-[19px]">
          Drop your website below and you&apos;ll get a spot in the queue right away. Watch it move — once it&apos;s been
          checked, it lands in Done.
        </p>

        <SubmitForm onSubmit={handleSubmit} />

        {myIndex >= 0 && (
          <div role="status" className="mt-4 flex flex-wrap items-center gap-5 rounded-2xl bg-ink px-6 py-5 text-white">
            <span className="font-display text-[44px] font-bold leading-none">#{myIndex + 1}</span>
            <div className="flex-[1_1_260px]">
              <div className="text-[17px] font-semibold">You&apos;re in line!</div>
              <div className="text-[15px] text-[#C9CCD3]">
                {ahead} ahead of you. Your row is highlighted below.
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a href="#queue" className="rounded-[10px] border border-[#5A5F6B] px-4 py-2.5 font-medium hover:bg-white/10">
                See my spot
              </a>
              <button
                type="button"
                onClick={handleRemoveMine}
                className="cursor-pointer rounded-[10px] bg-white px-4 py-2.5 font-semibold text-[#A3330B] hover:bg-[#FDF3EC]"
              >
                Leave queue
              </button>
            </div>
          </div>
        )}
      </section>

      <HowItWorks />

      <QueueList queue={queue} done={done} mineId={mineId} onRemoveMine={handleRemoveMine} />
    </>
  );
}
