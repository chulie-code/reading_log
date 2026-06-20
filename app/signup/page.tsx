import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage() {
  // 이미 로그인한 사용자는 홈으로 보냅니다.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) {
    redirect("/");
  }

  return (
    <main className="paper-bg flex flex-1 items-center justify-center px-6 py-24">
      <AuthForm mode="signup" />
    </main>
  );
}
