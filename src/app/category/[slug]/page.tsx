"use client";

import AppShell from "@/components/AppShell";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "food";

  useEffect(() => {
    router.replace(`/category/${slug}/guided`);
  }, [router, slug]);

  return (
    <AppShell>
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Opening {slug} guided mode...
        </div>
      </div>
    </AppShell>
  );
}