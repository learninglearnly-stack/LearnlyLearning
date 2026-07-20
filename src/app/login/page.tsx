import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { MarketingLayout } from "@/components/layout/marketing-layout";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Learnly account to manage bookings, messages, and profile.",
};

export default function LoginPage() {
  return (
    <MarketingLayout>
      <section className="section-container py-16 lg:py-24">
        <LoginForm />
      </section>
    </MarketingLayout>
  );
}
