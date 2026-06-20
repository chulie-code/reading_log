"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addNote, type FormState } from "@/app/dashboard/actions";

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-end rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "저장 중..." : "메모 추가"}
    </button>
  );
}

export function NoteForm({ bookId }: { bookId: string }) {
  const [state, formAction] = useActionState(addNote, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl border border-border-warm bg-surface p-5"
    >
      <input type="hidden" name="book_id" value={bookId} />
      <textarea
        name="content"
        required
        rows={3}
        placeholder="생각이나 인상 깊은 구절을 적어보세요."
        aria-label="메모 내용"
        className="w-full resize-y rounded-xl border border-border-warm bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      <div className="flex items-center justify-between gap-3">
        <select
          name="type"
          aria-label="메모 유형"
          defaultValue="thought"
          className="rounded-xl border border-border-warm bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
        >
          <option value="thought">생각</option>
          <option value="quote">인용</option>
        </select>
        <SubmitButton />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
