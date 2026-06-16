import { WaitlistForm } from "@/components/waitlist-form";
import { WAITLIST } from "@/lib/site";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="paper-bg border-t border-border-warm/60 px-6 py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          {WAITLIST.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          {WAITLIST.body}
        </p>
        <div className="mt-10">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
