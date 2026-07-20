import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how to find tutors, book lessons, and start learning on our platform.",
};

export default function HowItWorksPage() {
  return (
    <PlaceholderPage
      title="How It Works"
      description="A detailed walkthrough of the booking flow, messaging, and review process is coming soon."
    />
  );
}
