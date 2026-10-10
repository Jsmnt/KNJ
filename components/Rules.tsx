const rules = [
  { title: "Live sites only", text: "Links must open in a browser." },
  { title: "No duplicates", text: "The same website can only be in the line once." },
  { title: "Be kind", text: "Spam or unsafe links are removed without notice." },
];

export default function Rules() {
  return (
    <section id="rules" aria-label="Rules" className="mx-auto max-w-5xl px-6 pb-16">
      <div className="grid gap-6 border-t border-line pt-7 text-[15px] text-ink/80 sm:grid-cols-3">
        {rules.map((rule) => (
          <div key={rule.title}>
            <div className="font-semibold text-ink">{rule.title}</div>
            {rule.text}
          </div>
        ))}
      </div>
    </section>
  );
}
