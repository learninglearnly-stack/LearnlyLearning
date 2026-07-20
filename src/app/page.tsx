import { MarketingLayout } from "@/components/layout/marketing-layout";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { StatsBar } from "@/components/marketing/stats-bar";
import { SubjectsSection } from "@/components/marketing/subjects-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { APP_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: absoluteUrl("/"),
  description:
    "Discover expert tutors, book 1-on-1 lessons, and achieve your learning goals online.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absoluteUrl("/tutors?q={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <StatsBar />
      <BenefitsSection />
      <SubjectsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </MarketingLayout>
  );
}
