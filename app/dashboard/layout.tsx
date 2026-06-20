import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";

// /dashboard 하위는 로그인한 사용자만 접근할 수 있습니다.
// proxy(미들웨어)는 세션 갱신만 하므로, 보호는 여기서 직접 처리합니다.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12">{children}</div>
      </main>
      <Footer />
    </>
  );
}
