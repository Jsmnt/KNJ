"use client";

import { useState } from "react";
import type { Submission } from "@/lib/types";
import { displayUrl, timeAgo } from "@/lib/utils";
import { useNow } from "@/lib/use-now";

type Props = {
  queue: Submission[];
  done: Submission[];
  mineIds: Set<string>;
  onRemove: (id: string) => void;
  loading: boolean;
  loadError: boolean;
};

export default function QueueList({ queue, done, mineIds, onRemove, loading, loadError }: Props) {
  const [tab, setTab] = useState<"queue" | "done">("queue");
  const now = useNow();

  return (
    <section id="queue" aria-labelledby="queue-heading" className="mx-auto max-w-5xl scroll-mt-6 px-6 pb-14 pt-2">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <h2 id="queue-heading" className="font-display text-4xl font-bold tracking-tight">
          The line
        </h2>
        <div role="tablist" aria-label="Queue or done" className="flex gap-1 rounded-xl bg-[#E9E7E0] p-1">
          <TabButton active={tab === "queue"} onClick={() => setTab("queue")}>
            In queue · {queue.length}
          </TabButton>
          <TabButton active={tab === "done"} onClick={() => setTab("done")}>
            Done · {done.length}
          </TabButton>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mb-3 rounded-xl bg-pending-bg px-4 py-3 text-sm font-medium text-pending">
          Couldn&apos;t refresh the queue. Retrying automatically…
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {loading ? (
          <Empty text="Loading the queue…" />
        ) : (
          <>
            {tab === "queue" &&
              (queue.length === 0 ? (
                <Empty text="The queue is empty — be the first to paste a link." />
              ) : (
                <ul>
                  {queue.map((item, i) => {
                    const isMine = mineIds.has(item.id);
                    return (
                      <li
                        key={item.id}
                        className={`flex flex-wrap items-center gap-4 border-b border-[#EDEBE5] px-5 py-4 last:border-b-0 ${isMine ? "bg-[#FFF7E0]" : ""}`}
                      >
                        <span className="w-7 font-mono text-[15px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-[10px] bg-[#EDEBE5] font-display font-bold text-ink/80">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                        <SiteInfo item={item} />
                        <span className="text-sm text-muted">{timeAgo(item.createdAt, now)}</span>
                        {isMine && (
                          <>
                            <span className="rounded-full bg-ink px-2.5 py-1 text-[13px] font-semibold text-white">You</span>
                            <button
                              type="button"
                              onClick={() => onRemove(item.id)}
                              className="h-9 cursor-pointer rounded-lg border border-[#E8C4B0] bg-white px-3 text-sm font-semibold text-[#A3330B] hover:bg-[#FDF3EC]"
                            >
                              Remove
                            </button>
                          </>
                        )}
                        <span className="rounded-full bg-pending-bg px-3 py-1 text-[13px] font-semibold text-pending">
                          {i === 0 ? "Up next" : "Waiting"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ))}

            {tab === "done" &&
              (done.length === 0 ? (
                <Empty text="Nothing checked yet." />
              ) : (
                <ul>
                  {done.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center gap-4 border-b border-[#EDEBE5] px-5 py-4 last:border-b-0">
                      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-[10px] bg-done-bg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F3FB8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <SiteInfo item={item} />
                      <span className="text-sm text-muted">Checked {timeAgo(item.checkedAt, now)}</span>
                      <span className="rounded-full bg-done-bg px-3 py-1 text-[13px] font-semibold text-done">Finished</span>
                    </li>
                  ))}
                </ul>
              ))}
          </>
        )}
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-11 cursor-pointer rounded-[9px] px-4 ${active ? "bg-white font-semibold text-ink shadow-sm" : "font-medium text-[#4A4F5A] hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

function SiteInfo({ item }: { item: Submission }) {
  return (
    <div className="min-w-0 flex-[1_1_220px]">
      <div className="font-semibold">{item.name}</div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="font-mono text-sm text-done [overflow-wrap:anywhere] hover:text-ink"
      >
        {displayUrl(item.url)}
      </a>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-5 py-10 text-center text-muted">{text}</p>;
}
