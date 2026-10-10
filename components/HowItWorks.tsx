const steps = [
  { title: "Paste", text: "Submit your link — no account needed." },
  { title: "Wait in the queue", text: "Your position updates as sites get checked." },
  { title: "Done", text: "Checked sites move to the Done list." },
];

export default function HowItWorks() {
  return (
    <section id="how" aria-label="How it works" className="mx-auto max-w-5xl px-6 pb-10 pt-2">
      <ol className="grid gap-3.5 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-[14px] border border-line bg-white p-5">
            <div className="font-mono text-[13px] text-accent">0{i + 1}</div>
            <div className="mt-1.5 font-semibold">{step.title}</div>
            <div className="text-[15px] text-muted">{step.text}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
