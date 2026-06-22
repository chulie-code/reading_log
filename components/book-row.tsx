"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { updateBookTitle } from "@/app/dashboard/actions";

type Book = {
  id: string;
  title: string;
  author: string | null;
  status: string;
};

type StatusMeta = { label: string; className: string };

export function BookRow({ book, meta }: { book: Book; meta: StatusMeta }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  // 폼 제출 시 서버 액션을 호출하고, 성공하면 보기 모드로 돌아갑니다.
  function handleSave(formData: FormData) {
    startTransition(async () => {
      const result = await updateBookTitle({}, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setError(undefined);
        setEditing(false);
      }
    });
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-border-warm bg-surface px-5 py-4">
        <form action={handleSave} className="flex items-center gap-2">
          <input type="hidden" name="id" value={book.id} />
          <input
            name="title"
            type="text"
            required
            defaultValue={book.title}
            aria-label="책 제목"
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-border-warm bg-background px-4 py-2 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError(undefined);
              setEditing(false);
            }}
            className="shrink-0 rounded-full border border-border-warm px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            취소
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-2 text-sm text-accent">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-warm bg-surface px-5 py-4 transition-colors hover:border-accent">
      <Link href={`/dashboard/${book.id}`} className="min-w-0 flex-1">
        <p className="truncate font-serif text-lg font-bold text-foreground">
          {book.title}
        </p>
        {book.author && (
          <p className="truncate text-sm text-muted">{book.author}</p>
        )}
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-border-warm px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          수정
        </button>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>
    </div>
  );
}
