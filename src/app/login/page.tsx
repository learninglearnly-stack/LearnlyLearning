import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Learnly account to manage bookings, messages, and profile.",
};

export default function LoginPage() {
  return (
    <PlaceholderPage
      title="Sign In"
      description="Authentication with email/password and Google login will be implemented in Phase 2."
    />
  );
}
