import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission to connect students with expert tutors worldwide.",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About Us"
      description="Our story and mission page is coming in the next phase. We're building a platform that makes quality tutoring accessible to everyone."
    />
  );
}
