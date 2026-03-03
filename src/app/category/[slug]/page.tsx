import AppShell from "@/components/AppShell";
import ModeCard from "@/components/ModeCard";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryModePage({
  params,
}: {
  params: { slug: string };
}) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  return (
    <AppShell>
      <Link href="/home" className="text-sm text-slate-500 hover:underline">
        ← Back
      </Link>

      <div className="mt-4">
        <div className="text-xs text-slate-500">Category</div>
        <h1 className="text-3xl font-bold">
          {category ? category.title : "Category"}
        </h1>
      </div>

      <div className="mt-6">
        <div className="text-lg font-semibold">How would you like to decide?</div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Choose how you want TrueNorth to help you.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <ModeCard
          title="Guided Mode"
          subtitle="Answer quick questions and get personalized picks"
          href={`/category/${params.slug}/guided`}
          recommended
        />
        <ModeCard
          title="Chat Mode"
          subtitle="Have a conversation to refine your preferences"
          href={`/category/${params.slug}/chat`}
        />
        <ModeCard
          title="Voice Mode"
          subtitle="Speak naturally and let AI understand your needs"
          href={`/category/${params.slug}/voice`}
        />
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        You can switch modes at any time during the process
      </p>
    </AppShell>
  );
}