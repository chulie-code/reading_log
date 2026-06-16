"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addToWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { WAITLIST } from "@/lib/site";

const initialState: WaitlistState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-full bg-accent px-7 py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? WAITLIST.pending : WAITLIST.button}
    </button>
  );
}

export function WaitlistForm() {
  const [state, formAction] = useActionState(addToWaitlist, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-border-warm bg-surface px-8 py-10 text-center shadow-sm">
        <p className="font-serif text-2xl text-foreground">
          {WAITLIST.successTitle}
        </p>
        <p className="mt-3 text-muted">{WAITLIST.successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={WAITLIST.placeholder}
          aria-label="이메일 주소"
          className="w-full rounded-full border border-border-warm bg-surface px-6 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <SubmitButton />
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {state.message}
        </p>
      )}
    </form>
  );
}
