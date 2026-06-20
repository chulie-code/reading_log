"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, signup, type AuthState } from "@/app/auth/actions";

const initialState: AuthState = {};

type Mode = "login" | "signup";

const COPY: Record<
  Mode,
  {
    title: string;
    submit: string;
    pending: string;
    altText: string;
    altLink: string;
    altHref: string;
    autoComplete: string;
  }
> = {
  login: {
    title: "로그인",
    submit: "로그인",
    pending: "로그인 중...",
    altText: "아직 계정이 없으신가요?",
    altLink: "회원가입",
    altHref: "/signup",
    autoComplete: "current-password",
  },
  signup: {
    title: "회원가입",
    submit: "가입하기",
    pending: "가입 중...",
    altText: "이미 계정이 있으신가요?",
    altLink: "로그인",
    altHref: "/login",
    autoComplete: "new-password",
  },
};

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-accent px-7 py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? COPY[mode].pending : COPY[mode].submit}
    </button>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const action = mode === "login" ? login : signup;
  const [state, formAction] = useActionState(action, initialState);
  const copy = COPY[mode];

  return (
    <div className="w-full max-w-md rounded-2xl border border-border-warm bg-surface px-8 py-10 shadow-sm">
      <h1 className="text-center font-serif text-3xl font-bold text-foreground">
        {copy.title}
      </h1>

      {state.message ? (
        <p className="mt-6 rounded-xl bg-accent/10 px-5 py-4 text-center text-foreground">
          {state.message}
        </p>
      ) : (
        <form action={formAction} className="mt-8 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-muted">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full rounded-xl border border-border-warm bg-background px-5 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-muted">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={copy.autoComplete}
              placeholder="6자 이상"
              className="w-full rounded-xl border border-border-warm bg-background px-5 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-accent">
              {state.error}
            </p>
          )}

          <div className="mt-2">
            <SubmitButton mode={mode} />
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        {copy.altText}{" "}
        <Link
          href={copy.altHref}
          className="font-medium text-accent hover:underline"
        >
          {copy.altLink}
        </Link>
      </p>
    </div>
  );
}
