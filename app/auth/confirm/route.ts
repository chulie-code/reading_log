import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 회원가입 확인 메일의 링크가 도착하는 곳입니다.
// 이메일 템플릿이 token_hash & type 쿼리를 넘겨주도록 설정되어 있어야 합니다.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // 오픈 리다이렉트 방지: 같은 사이트 내부 경로만 허용합니다.
  // "/"로 시작하되 "//"(프로토콜 상대 URL → 외부 도메인)는 거부합니다.
  const nextParam = searchParams.get("next") ?? "/";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      // 확인 성공 → 쿠키 세션이 설정된 상태로 이동
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // 토큰이 없거나 만료/오류인 경우
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
