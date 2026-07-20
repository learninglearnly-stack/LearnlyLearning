"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Subject } from "@/types";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("subjects")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setSubjects((data ?? []) as Subject[]);
        setIsLoaded(true);
      });
  }, []);

  return { subjects, isLoaded };
}
