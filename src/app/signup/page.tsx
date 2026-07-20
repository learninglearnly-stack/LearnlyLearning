import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Learnly account as a student or tutor.",
};

export default function SignupPage() {
  return (
    <PlaceholderPage
      title="Create Account"
      description="Student and tutor registration with Supabase Auth will be implemented in Phase 2."
    />
  );
}
