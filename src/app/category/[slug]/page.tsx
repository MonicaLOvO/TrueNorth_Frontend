"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function VoicePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";
  const [listening, setListening] = useState(false);

  return (
    <AppShell>
      <Link href={`/category/${slug}`} className="text-sm text-slate-500 hover:underline">
        ← Back
      </Link>

      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <div className="text-xl font-semibold">How can I help you decide?</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This is a frontend voice stub for now, but the button now responds and shows state.
        </p>

        <button
          onClick={() => setListening((value) => !value)}
          className={[
            "mt-8 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-md transition",
            listening ? "bg-red-500 hover:bg-red-600" : "bg-sky-600 hover:bg-sky-700",
          ].join(" ")}
        >
          🎙️
        </button>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          {listening ? "Listening... tap again to stop." : "Tap the mic to simulate listening."}
        </p>
      </div>
    </AppShell>
  );
}