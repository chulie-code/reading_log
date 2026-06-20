import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteForm } from "@/components/note-form";
import { AiDigest } from "@/components/ai-digest";
import type { ReadingDigest } from "@/lib/openrouter";
import {
  updateBookStatus,
  deleteBook,
  deleteNote,
} from "@/app/dashboard/actions";

type Note = {
  id: string;
  content: string;
  type: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "reading", label: "읽는 중" },
  { value: "done", label: "완독" },
  { value: "want", label: "읽고 싶음" },
];

const NOTE_LABEL: Record<string, string> = {
  thought: "생각",
  quote: "인용",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS로 본인 책만 조회됩니다. 없으면 404.
  const { data: book } = await supabase
    .from("books")
    .select("id, title, author, status")
    .eq("id", id)
    .maybeSingle();

  if (!book) {
    notFound();
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("id, content, type, created_at")
    .eq("book_id", id)
    .order("created_at", { ascending: false });

  const noteList = (notes ?? []) as Note[];

  // 가장 최근 AI 정리 결과를 불러옵니다(있으면 캐싱된 결과를 바로 보여줌).
  const { data: digestRow } = await supabase
    .from("digests")
    .select("data")
    .eq("book_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initialDigest = (digestRow?.data ?? null) as ReadingDigest | null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/dashboard"
        className="text-sm text-muted transition-colors hover:text-accent"
      >
        ← 내 서재
      </Link>

      {/* 책 정보 + 상태 변경 + 삭제 */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border-warm bg-surface p-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {book.title}
          </h1>
          {book.author && <p className="mt-1 text-muted">{book.author}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form action={updateBookStatus} className="flex items-center gap-2">
            <input type="hidden" name="id" value={book.id} />
            <select
              name="status"
              defaultValue={book.status}
              aria-label="읽기 상태"
              className="rounded-xl border border-border-warm bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full border border-border-warm px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
            >
              상태 변경
            </button>
          </form>

          <form action={deleteBook} className="ml-auto">
            <input type="hidden" name="id" value={book.id} />
            <button
              type="submit"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              책 삭제
            </button>
          </form>
        </div>
      </div>

      {/* AI 정리 */}
      <AiDigest
        bookId={book.id}
        initialDigest={initialDigest}
        noteCount={noteList.length}
      />

      {/* 메모 작성 */}
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-bold text-foreground">메모</h2>
        <NoteForm bookId={book.id} />

        {noteList.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-warm bg-surface px-6 py-10 text-center text-muted">
            아직 메모가 없습니다. 첫 기록을 남겨보세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {noteList.map((note) => (
              <li
                key={note.id}
                className="rounded-2xl border border-border-warm bg-surface p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {NOTE_LABEL[note.type] ?? "생각"}
                  </span>
                  <div className="flex items-center gap-3">
                    <time className="text-xs text-muted">
                      {formatDate(note.created_at)}
                    </time>
                    <form action={deleteNote}>
                      <input type="hidden" name="id" value={note.id} />
                      <input type="hidden" name="book_id" value={book.id} />
                      <button
                        type="submit"
                        aria-label="메모 삭제"
                        className="text-xs text-muted transition-colors hover:text-accent"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-foreground">
                  {note.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
