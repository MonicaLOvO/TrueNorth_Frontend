"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function VoicePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";
  const [listening, setListening] = useState(false);

  return (
    <AppShell>
      <BackButton href={`/category/${slug}`} />

      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <div className="text-xl font-semibold text-slate-900 dark:text-white">
          How can I help you decide?
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {listening
            ? "Listening… tap again to stop."
            : "Tap the mic to start speaking."}
        </p>

        <button
          onClick={() => setListening((v) => !v)}
          className={[
            "mt-8 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95",
            listening
              ? "bg-red-500 shadow-red-500/30 hover:bg-red-600"
              : "bg-sky-600 shadow-sky-600/30 hover:bg-sky-700",
          ].join(" ")}
          aria-label={listening ? "Stop listening" : "Start listening"}
        >
          <span className="text-3xl">{listening ? "⏹️" : "🎙️"}</span>
        </button>
      </div>
    </AppShell>
  );
}