import { HERO } from "@/lib/site";

export function HeroSection() {
  return (
    <section
      id="top"
      className="paper-bg relative overflow-hidden px-6 pt-24 pb-28 sm:pt-32"
    >
      <div className="mx-auto max-w-3xl text-center animate-fade-up">
        <p className="mb-6 inline-block rounded-full border border-border-warm bg-surface/70 px-4 py-1.5 text-sm text-muted">
          {HERO.eyebrow}
        </p>
        <h1 className="font-serif text-4xl font-extrabold leading-[1.25] tracking-tight sm:text-6xl">
          {HERO.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          {HERO.subline}
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href="#waitlist"
            className="rounded-full bg-accent px-8 py-4 text-lg font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            {HERO.cta}
          </a>
          <p className="text-sm text-muted">{HERO.note}</p>
        </div>
      </div>
    </section>
  );
}
