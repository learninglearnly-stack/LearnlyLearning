import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about finding tutors, booking lessons, and payments.",
};

export default function FaqPage() {
  return (
    <PlaceholderPage
      title="Frequently Asked Questions"
      description="Common questions about payments, bookings, and tutor verification will be answered here."
    />
  );
}
