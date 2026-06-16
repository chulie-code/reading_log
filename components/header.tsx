import { BRAND } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-warm/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-serif text-xl font-bold tracking-tight">
          {BRAND.name}
        </a>
        <a
          href="#waitlist"
          className="rounded-full border border-accent px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
        >
          대기자 등록
        </a>
      </div>
    </header>
  );
}
