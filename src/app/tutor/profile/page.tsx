import type { Metadata } from "next";

import { TutorProfileForm } from "@/components/dashboard/tutor-profile-form";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your tutor profile, subjects, rates, and experience.",
};

export default function TutorProfilePage() {
  return <TutorProfileForm />;
}
