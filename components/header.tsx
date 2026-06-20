import Link from "next/link";
import { BRAND } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-border-warm/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          {BRAND.name}
        </Link>

        {email ? (
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="font-medium text-muted transition-colors hover:text-accent"
            >
              내 서재
            </Link>
            <span className="hidden text-muted sm:inline">{email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-border-warm px-5 py-2 font-medium text-muted transition-colors hover:border-accent hover:text-accent"
              >
                로그아웃
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 font-medium text-muted transition-colors hover:text-accent"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-accent px-5 py-2 font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
