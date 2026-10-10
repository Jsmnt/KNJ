import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
              <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight">KNJ</span>
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-6 text-[15px] text-ink/75">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#queue" className="hover:text-ink">Queue</a>
          <a href="#rules" className="hover:text-ink">Rules</a>
          <Link href="/login" className="rounded-lg border border-[#CFCCC3] px-3.5 py-2 font-medium text-ink hover:bg-white">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
