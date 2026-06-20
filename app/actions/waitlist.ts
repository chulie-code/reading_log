"use server";

import { createClient } from "@/lib/supabase/server";

// 대기자 이메일을 Supabase `waitlist` 테이블에 저장합니다.
// (이전에는 로컬 JSON 파일에 저장했으나, 서버리스 환경에서 데이터가
//  유실되는 문제가 있어 DB로 이전했습니다.)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function addToWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { status: "error", message: "이메일을 입력해 주세요." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { status: "error", message: "올바른 이메일 형식이 아닙니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    // 23505 = unique 제약 위반 → 이미 등록된 이메일
    if (error.code === "23505") {
      return { status: "error", message: "이미 등록된 이메일입니다." };
    }
    return { status: "error", message: "잠시 후 다시 시도해 주세요." };
  }

  return { status: "success" };
}
