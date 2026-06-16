import { FEATURES } from "@/lib/site";

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            {FEATURES.title}
          </h2>
          <p className="mt-4 text-lg text-muted">{FEATURES.subtitle}</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {FEATURES.items.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border-warm bg-surface p-8 shadow-sm transition-transform hover:-translate-y-1"
            >
              <span aria-hidden className="text-4xl">
                {item.icon}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-bold">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
