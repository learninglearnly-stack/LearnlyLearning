import type { Metadata } from "next";

import { BecomeATutorContent } from "@/components/marketing/become-a-tutor-content";

export const metadata: Metadata = {
  title: "Become a Tutor",
  description:
    "Join Learnly as a tutor. Set your rates, manage availability, and teach students with zero platform commission.",
};

export default function BecomeATutorPage() {
  return <BecomeATutorContent />;
}
