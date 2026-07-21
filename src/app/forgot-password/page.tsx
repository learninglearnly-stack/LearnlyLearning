import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { MarketingLayout } from "@/components/layout/marketing-layout";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your StudySpark Tutors account password.",
};

export default function ForgotPasswordPage() {
  return (
    <MarketingLayout>
      <section className="section-container py-16 lg:py-24">
        <ForgotPasswordForm />
      </section>
    </MarketingLayout>
  );
}
