import { STEPS } from "@/lib/site";

export function HowItWorksSection() {
  return (
    <section className="border-y border-border-warm/60 bg-surface px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">
          {STEPS.title}
        </h2>
        <ol className="mt-16 grid gap-10 sm:grid-cols-3">
          {STEPS.items.map((item) => (
            <li key={item.step} className="relative text-center sm:text-left">
              <span className="font-serif text-5xl font-extrabold text-accent/30">
                {item.step}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
