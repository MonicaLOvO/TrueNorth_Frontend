"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import ModeCard from "@/components/ModeCard";
import { CATEGORIES } from "@/lib/categories";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";
  const category = CATEGORIES.find((c) => c.slug === slug);

  return (
    <AppShell>
      <BackButton href="/home" />

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-3xl shadow-sm dark:bg-sky-950">
          {category?.emoji ?? "🧭"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {category?.title ?? slug}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {category?.subtitle ?? "Choose how you'd like help"}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Choose a mode
        </p>
        <ModeCard
          title="Guided"
          subtitle="Answer a few questions, get tailored suggestions"
          href={`/category/${slug}/guided`}
          recommended
        />
        <ModeCard
          title="Chat"
          subtitle="Have a freeform conversation with AI"
          href={`/category/${slug}/chat`}
        />
        <ModeCard
          title="Voice"
          subtitle="Speak your decision aloud"
          href={`/category/${slug}/voice`}
        />
      </div>
    </AppShell>
  );
}