"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addBook, type FormState } from "@/app/dashboard/actions";

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "추가 중..." : "추가"}
    </button>
  );
}

export function BookForm() {
  const [state, formAction] = useActionState(addBook, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // 추가에 성공하면(에러 없음) 입력칸을 비웁니다.
  useEffect(() => {
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-border-warm bg-surface p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="title"
          type="text"
          required
          placeholder="책 제목"
          aria-label="책 제목"
          className="flex-1 rounded-xl border border-border-warm bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <input
          name="author"
          type="text"
          placeholder="저자 (선택)"
          aria-label="저자"
          className="flex-1 rounded-xl border border-border-warm bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <SubmitButton />
      </div>
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {state.error}
        </p>
      )}
    </form>
  );
}
