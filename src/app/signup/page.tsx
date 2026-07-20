import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/signup-form";
import { MarketingLayout } from "@/components/layout/marketing-layout";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Learnly account as a student or tutor.",
};

export default function SignupPage() {
  return (
    <MarketingLayout>
      <section className="section-container py-16 lg:py-24">
        <SignupForm />
      </section>
    </MarketingLayout>
  );
}
