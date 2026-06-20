"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestDigest, type DigestState } from "@/app/dashboard/actions";
import type { ReadingDigest } from "@/lib/openrouter";

function SubmitButton({ hasDigest }: { hasDigest: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "정리 중..." : hasDigest ? "다시 정리" : "AI 정리"}
    </button>
  );
}

function DigestCard({ digest }: { digest: ReadingDigest }) {
  return (
    <div className="flex flex-col gap-5">
      {/* 전체 요약 */}
      <p className="whitespace-pre-wrap leading-relaxed text-foreground">
        {digest.summary}
      </p>

      {/* 주제별 정리 */}
      <ul className="flex flex-col gap-3">
        {digest.themes.map((theme, i) => (
          <li
            key={i}
            className="rounded-2xl border border-border-warm bg-background p-5"
          >
            <h4 className="font-serif text-lg font-bold text-foreground">
              {theme.title}
            </h4>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">
              {theme.insight}
            </p>
            {theme.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {theme.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 오늘의 한 걸음 */}
      <div className="rounded-2xl bg-accent/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          오늘의 한 걸음
        </p>
        <p className="mt-2 font-serif text-lg font-bold text-foreground">
          {digest.today_step.action}
        </p>
        <p className="mt-2 text-foreground">{digest.today_step.why}</p>
        <p className="mt-2 text-sm text-muted">
          메모 근거: {digest.today_step.based_on}
        </p>
      </div>
    </div>
  );
}

export function AiDigest({
  bookId,
  initialDigest,
  noteCount,
}: {
  bookId: string;
  initialDigest: ReadingDigest | null;
  noteCount: number;
}) {
  const [state, formAction] = useActionState<DigestState, FormData>(
    requestDigest,
    { data: initialDigest ?? undefined },
  );

  const digest = state.data;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border-warm bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">
            AI 정리
          </h2>
          <p className="mt-1 text-sm text-muted">
            남긴 메모를 주제로 묶고, 오늘의 한 걸음을 제안해 드려요.
          </p>
        </div>
        {noteCount > 0 ? (
          <form action={formAction}>
            <input type="hidden" name="book_id" value={bookId} />
            <SubmitButton hasDigest={Boolean(digest)} />
          </form>
        ) : (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-accent px-6 py-2.5 font-medium text-white opacity-60"
          >
            AI 정리
          </button>
        )}
      </div>

      {noteCount === 0 && (
        <p className="text-sm text-muted">
          정리할 메모가 없습니다. 먼저 메모를 남겨 주세요.
        </p>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}

      {digest && <DigestCard digest={digest} />}
    </section>
  );
}
