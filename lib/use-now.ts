"use client";

import { useEffect, useState } from "react";

// The current time, refreshed every minute so "5 min ago" labels stay correct.
// It starts as null and is filled in after the page loads in the browser,
// which keeps the server and browser versions of the page identical.
export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  return now;
}
