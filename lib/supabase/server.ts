import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 서버(Server Component·Server Action·Route Handler)에서 사용하는 Supabase 클라이언트입니다.
// 요청마다 새로 생성해야 하므로 함수로 제공합니다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출되면 set이 막힐 수 있습니다.
            // 세션 갱신은 proxy(미들웨어)에서 처리하므로 무시해도 됩니다.
          }
        },
      },
    },
  );
}
