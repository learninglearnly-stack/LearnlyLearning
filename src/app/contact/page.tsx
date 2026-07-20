import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our support team for help with your account or bookings.",
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact Us"
      description="A contact form with support options will be available in a future phase."
    />
  );
}
