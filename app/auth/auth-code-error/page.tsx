import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="paper-bg flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border-warm bg-surface px-8 py-10 text-center shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          링크를 확인할 수 없습니다
        </h1>
        <p className="mt-3 text-muted">
          인증 링크가 만료되었거나 이미 사용되었습니다. 다시 시도해 주세요.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
        >
          로그인으로 이동
        </Link>
      </div>
    </main>
  );
}
