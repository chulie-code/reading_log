"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createDigest, type ReadingDigest } from "@/lib/openrouter";

// 폼(useActionState)에서 에러를 표시하기 위한 상태 타입입니다.
export type FormState = { error?: string };

// AI 정리(useActionState)용 상태 타입입니다. 성공 시 data, 실패 시 error.
export type DigestState = { data?: ReadingDigest; error?: string };

// 허용된 값만 DB에 들어가도록 화이트리스트로 검증합니다.
const BOOK_STATUSES = ["reading", "done", "want"] as const;
const NOTE_TYPES = ["thought", "quote"] as const;

// AI 정리 남용·비용 방어: 같은 책은 5분에 한 번만 다시 정리할 수 있습니다.
const DIGEST_COOLDOWN_MS = 5 * 60 * 1000;

// 현재 로그인한 사용자의 id를 가져옵니다. 없으면 로그인 페이지로 보냅니다.
async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  if (!userId) {
    redirect("/login");
  }
  return { supabase, userId };
}

export async function addBook(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();

  if (!title) {
    return { error: "책 제목을 입력해 주세요." };
  }

  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from("books").insert({
    user_id: userId,
    title,
    author: author || null,
    status: "reading",
  });

  if (error) {
    return { error: "책을 추가하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/dashboard");
  return {};
}

export async function updateBookStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !BOOK_STATUSES.includes(status as (typeof BOOK_STATUSES)[number])) {
    return;
  }

  const { supabase, userId } = await requireUserId();
  // RLS가 본인 데이터만 허용하지만, user_id 조건을 명시해 한 번 더 좁힙니다.
  await supabase
    .from("books")
    .update({ status })
    .eq("id", id)
    .eq("user_id", userId);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${id}`);
}

export async function updateBookTitle(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!id) {
    return { error: "잘못된 접근입니다." };
  }
  if (!title) {
    return { error: "책 제목을 입력해 주세요." };
  }

  const { supabase, userId } = await requireUserId();
  // RLS가 본인 데이터만 허용하지만, user_id 조건을 명시해 한 번 더 좁힙니다.
  const { error } = await supabase
    .from("books")
    .update({ title })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { error: "제목을 바꾸지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${id}`);
  return {};
}

export async function deleteBook(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { supabase, userId } = await requireUserId();
  // notes는 외래키 cascade로 함께 삭제됩니다.
  await supabase.from("books").delete().eq("id", id).eq("user_id", userId);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addNote(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const bookId = String(formData.get("book_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "thought");
  const type = NOTE_TYPES.includes(typeRaw as (typeof NOTE_TYPES)[number])
    ? typeRaw
    : "thought";

  if (!bookId) {
    return { error: "잘못된 접근입니다." };
  }
  if (!content) {
    return { error: "메모 내용을 입력해 주세요." };
  }

  const { supabase, userId } = await requireUserId();

  // 메모를 붙이려는 책이 본인 소유인지 먼저 확인합니다.
  // (RLS로 본인 책만 조회되므로, 조회되지 않으면 남의 책이거나 없는 책입니다.)
  const { data: ownedBook } = await supabase
    .from("books")
    .select("id")
    .eq("id", bookId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!ownedBook) {
    return { error: "잘못된 접근입니다." };
  }

  const { error } = await supabase.from("notes").insert({
    book_id: bookId,
    user_id: userId,
    content,
    type,
  });

  if (error) {
    return { error: "메모를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/dashboard/${bookId}`);
  return {};
}

export async function requestDigest(
  _prev: DigestState,
  formData: FormData,
): Promise<DigestState> {
  const bookId = String(formData.get("book_id") ?? "");
  if (!bookId) {
    return { error: "잘못된 접근입니다." };
  }

  const { supabase, userId } = await requireUserId();

  // RLS로 본인 책만 조회됩니다. 제목·저자를 프롬프트에 사용합니다.
  const { data: book } = await supabase
    .from("books")
    .select("title, author")
    .eq("id", bookId)
    .maybeSingle();

  if (!book) {
    return { error: "책을 찾을 수 없습니다." };
  }

  // 메모는 작성 순서(created_at 오름차순)대로 1·2·3… 번호를 매겨 전달합니다.
  const { data: notes } = await supabase
    .from("notes")
    .select("content")
    .eq("book_id", bookId)
    .order("created_at", { ascending: true });

  const noteList = (notes ?? []) as { content: string }[];
  if (noteList.length === 0) {
    return { error: "정리할 메모가 없습니다. 먼저 메모를 남겨 주세요." };
  }

  // 비용 방어: 같은 책을 마지막으로 정리한 지 5분이 안 됐으면 AI 호출 없이 막습니다.
  const { data: lastDigest } = await supabase
    .from("digests")
    .select("created_at")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastDigest?.created_at) {
    const elapsed = Date.now() - new Date(lastDigest.created_at).getTime();
    if (elapsed < DIGEST_COOLDOWN_MS) {
      const waitMin = Math.ceil((DIGEST_COOLDOWN_MS - elapsed) / 60000);
      return {
        error: `방금 정리했어요. 약 ${waitMin}분 후에 다시 시도해 주세요.`,
      };
    }
  }

  let digest: ReadingDigest;
  try {
    digest = await createDigest({
      title: book.title,
      author: book.author ?? null,
      notes: noteList,
    });
  } catch {
    return {
      error: "AI 정리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  // 새 행으로 저장(이력 보존). 화면에는 최신 1개를 보여줍니다.
  const { error } = await supabase.from("digests").insert({
    book_id: bookId,
    user_id: userId,
    data: digest,
  });

  if (error) {
    return { error: "정리 결과를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/dashboard/${bookId}`);
  return { data: digest };
}

export async function deleteNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const bookId = String(formData.get("book_id") ?? "");
  if (!id) return;

  const { supabase, userId } = await requireUserId();
  await supabase.from("notes").delete().eq("id", id).eq("user_id", userId);

  if (bookId) revalidatePath(`/dashboard/${bookId}`);
}
