import { BRAND } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border-warm/60 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
        <p className="font-serif text-base text-foreground">
          {BRAND.name}
          <span className="ml-2 font-sans text-muted">· {BRAND.tagline}</span>
        </p>
        <p>
          © {new Date().getFullYear()} {BRAND.name}. 출시 준비 중입니다.
        </p>
      </div>
    </footer>
  );
}
