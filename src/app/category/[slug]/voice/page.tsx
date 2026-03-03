import AppShell from "@/components/AppShell";
import Link from "next/link";

export default function VoicePage({ params }: { params: { slug: string } }) {
  return (
    <AppShell>
      <Link
        href={`/category/${params.slug}`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Back
      </Link>

      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <div className="text-xl font-semibold">How can I help you decide?</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Tap to speak
        </p>

        <div className="mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-sky-600 text-white shadow-md">
          🎙️
        </div>

        <p className="mt-6 text-xs text-slate-500">
          (Voice can be implemented later — this screen is a Sprint 2 stub.)
        </p>
      </div>
    </AppShell>
  );
}