import type { Metadata } from "next";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { BRAND, HERO } from "@/lib/site";

// 제목·강조용 세리프 (문학적 감성)
const serif = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

// 본문용 산세리프 (가독성)
const sans = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${HERO.headline.join(" ")}`,
  description: HERO.subline,
  openGraph: {
    title: `${BRAND.name} · ${BRAND.tagline}`,
    description: HERO.subline,
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
