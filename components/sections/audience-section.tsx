import { AUDIENCE } from "@/lib/site";

export function AudienceSection() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-bold leading-snug sm:text-4xl">
          {AUDIENCE.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {AUDIENCE.body}
        </p>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {AUDIENCE.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border-warm bg-surface px-5 py-2 text-sm text-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
