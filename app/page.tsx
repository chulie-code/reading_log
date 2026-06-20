import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { AudienceSection } from "@/components/sections/audience-section";
import { WaitlistSection } from "@/components/sections/waitlist-section";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // 로그인한 사용자는 랜딩 대신 내 서재로 보냅니다.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) {
    redirect("/dashboard");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AudienceSection />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
