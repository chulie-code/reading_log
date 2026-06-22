import { createClient } from "@/lib/supabase/server";
import { BookForm } from "@/components/book-form";
import { BookRow } from "@/components/book-row";

type Book = {
  id: string;
  title: string;
  author: string | null;
  status: string;
  created_at: string;
};

// 상태 코드 → 한글 라벨/뱃지 스타일
const STATUS_META: Record<string, { label: string; className: string }> = {
  reading: { label: "읽는 중", className: "bg-accent/10 text-accent" },
  done: { label: "완독", className: "bg-foreground/10 text-foreground" },
  want: { label: "읽고 싶음", className: "bg-muted/10 text-muted" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  // RLS가 본인 책만 반환합니다.
  const { data: books } = await supabase
    .from("books")
    .select("id, title, author, status, created_at")
    .order("created_at", { ascending: false });

  const list = (books ?? []) as Book[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          내 서재
        </h1>
        <p className="mt-1 text-muted">읽고 있는 책과 기록을 모아둡니다.</p>
      </div>

      <BookForm />

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-warm bg-surface px-6 py-12 text-center text-muted">
          아직 등록한 책이 없습니다. 위에서 첫 책을 추가해 보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((book) => {
            const meta = STATUS_META[book.status] ?? STATUS_META.reading;
            return (
              <li key={book.id}>
                <BookRow book={book} meta={meta} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
