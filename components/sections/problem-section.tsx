import { PROBLEM } from "@/lib/site";

export function ProblemSection() {
  return (
    <section className="border-y border-border-warm/60 bg-surface px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-3xl font-bold leading-snug sm:text-4xl">
          {PROBLEM.title}
        </h2>
        <ul className="mt-10 space-y-6">
          {PROBLEM.points.map((point) => (
            <li
              key={point}
              className="flex gap-4 text-lg leading-relaxed text-muted"
            >
              <span aria-hidden className="mt-1 text-accent">
                —
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
