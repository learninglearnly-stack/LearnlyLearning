import type { Metadata } from "next";

import { SubjectsPageContent } from "@/components/subjects/subjects-page-content";

export const metadata: Metadata = {
  title: "Subjects",
  description:
    "Browse all subjects and find expert tutors in mathematics, languages, science, programming, and more.",
};

export default function SubjectsPage() {
  return <SubjectsPageContent />;
}
