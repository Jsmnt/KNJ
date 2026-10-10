"use client";

import { useState } from "react";

type Props = {
  // Resolves to an error message to show, or null if the link was accepted.
  onSubmit: (url: string, name: string) => Promise<string | null>;
};

export default function SubmitForm({ onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const problem = await onSubmit(url, name);
    setSending(false);
    if (problem) {
      setError(problem);
      return;
    }
    setUrl("");
    setName("");
    setError(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-9 flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5"
    >
      <label htmlFor="url" className="text-[15px] font-semibold">
        Your website link
      </label>
      <div className="flex flex-wrap gap-2.5">
        <input
          id="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://yourname.vercel.app"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "url-error" : undefined}
          className="h-14 min-w-0 flex-[999_1_320px] rounded-xl border-[1.5px] border-[#CFCCC3] bg-[#FBFAF7] px-4 font-mono text-lg outline-none placeholder:text-[#8A8E98] focus:border-accent"
        />
        <button
          type="submit"
          disabled={sending}
          className="h-14 flex-[1_1_160px] cursor-pointer rounded-xl bg-accent px-6 text-[17px] font-semibold text-white hover:bg-accent/90 disabled:cursor-wait disabled:opacity-70"
        >
          {sending ? "Adding…" : "Join the queue"}
        </button>
      </div>

      {error && (
        <p id="url-error" role="alert" className="text-sm font-medium text-[#A3330B]">
          {error}
        </p>
      )}

      <div className="flex max-w-sm flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-ink/80">
          Name or handle <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          maxLength={40}
          placeholder="Shown next to your link"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-[10px] border border-[#DAD7CF] bg-[#FBFAF7] px-3.5 text-[15px] outline-none placeholder:text-[#8A8E98] focus:border-accent"
        />
      </div>

      <p className="text-[13px] text-muted">
        Each website can only be submitted once. Repeat entries of the same site are rejected, even after it&apos;s done.
      </p>
    </form>
  );
}
