import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16부터 미들웨어는 `proxy.ts`로 명명됩니다.
// 모든 요청에서 Supabase 인증 세션을 갱신합니다.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 정적 파일·이미지 최적화·favicon을 제외한 모든 경로에서 실행합니다.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
