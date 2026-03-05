"use client";

import AppShell from "@/components/AppShell";

import Link from "next/link";

import { useMemo, useState } from "react";

import { useParams } from "next/navigation";

type Option = { label: string; emoji?: string };

type Q = { id: string; question: string; options: Option[] };

export default function GuidedPage() {

  const params = useParams();

  const slug = (params?.slug as string) || "";

  // --- Questions ---

  const questions: Q[] = useMemo(() => {

    if (slug === "food") {

      return [

        {

          id: "occasion",

          question: "What's the occasion?",

          options: [

            { emoji: "🍕", label: "Casual meal" },

            { emoji: "💞", label: "Date night" },

            { emoji: "👨‍👩‍👧‍👦", label: "Family dinner" },

            { emoji: "💼", label: "Business meeting" },

            { emoji: "🎉", label: "Celebration" },

            { emoji: "🧘", label: "Solo treat" },

          ],

        },

        {

          id: "mood",

          question: "What mood are you in?",

          options: [

            { emoji: "🌍", label: "Adventurous" },

            { emoji: "🤗", label: "Comfort food" },

            { emoji: "🥗", label: "Healthy & light" },

            { emoji: "🍰", label: "Indulgent" },

          ],

        },

        {

          id: "cuisine",

          question: "Any cuisine preference?",

          options: [

            { emoji: "🇮🇹", label: "Italian" },

            { emoji: "🥢", label: "Asian" },

            { emoji: "🌮", label: "Mexican" },

            { emoji: "🍔", label: "American" },

            { emoji: "🫒", label: "Mediterranean" },

            { emoji: "🎲", label: "Surprise me" },

          ],

        },

        {

          id: "budget",

          question: "What's your budget?",

          options: [

            { emoji: "💵", label: "Budget-friendly" },

            { emoji: "💳", label: "Moderate" },

            { emoji: "💎", label: "Ready to splurge" },

            { emoji: "🤷", label: "No preference" },

          ],

        },

      ];

    }

    // fallback (other categories) 

    return [

      {

        id: "pref",

        question: "What are you looking for?",

        options: [{ label: "Option A" }, { label: "Option B" }, { label: "Option C" }],

      },

    ];

  }, [slug]);

  // --- State ---

  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [selected, setSelected] = useState<string | null>(null);

  const done = step >= questions.length;

  const total = questions.length;

  const currentQ = !done ? questions[step] : null;

  // --- Recommendations 

  const recommendations = useMemo(() => {

    if (slug !== "food") {

      return [

        {

          title: "Sample Pick 1",

          subtitle: "A good option based on your choices",

          rating: "4.7",

          match: "92%",

          tags: ["Top Pick", "Open Now"],

        },

        {

          title: "Sample Pick 2",

          subtitle: "Another strong option",

          rating: "4.6",

          match: "88%",

          tags: ["Trending"],

        },

      ];

    }

    const occasion = answers.occasion || "Casual meal";

    const mood = answers.mood || "Comfort food";

    const cuisine = answers.cuisine || "Italian";

    const budget = answers.budget || "Moderate";

    //  fake restaurant cards 

    return [

      {

        title: "Trattoria Milano",

        subtitle: `${cuisine} • ${budget}`,

        rating: "4.8",

        match: "95%",

        tags: ["Top Pick", "Open Now", occasion, mood],

      },

      {

        title: "Bella Vista",

        subtitle: `${cuisine} • ${budget}`,

        rating: "4.6",

        match: "88%",

        tags: ["Trending", "Open Now"],

      },

      {

        title: "Osteria del Porto",

        subtitle: `${cuisine} • ${budget}`,

        rating: "4.7",

        match: "76%",

        tags: ["Seafood", occasion],

      },

    ];

  }, [answers, slug]);

  function goNext() {

    if (!currentQ) return;

    // save selection if there is one

    if (selected) {

      setAnswers((prev) => ({ ...prev, [currentQ.id]: selected }));

    }

    setSelected(null);

    setStep((s) => s + 1);

  }

  function skip() {

    setSelected(null);

    setStep((s) => s + 1);

  }

  function reset() {

    setStep(0);

    setAnswers({});

    setSelected(null);

  }

  const progressPct = total > 0 ? Math.round(((step + 1) / total) * 100) : 0;

  return (
<AppShell>

      {/* Top row */}
<div className="flex items-center justify-between">

        {/* Back to category list */}
<Link href="/home" className="text-sm text-slate-500 hover:underline">

          ← Back
</Link>
<div className="flex items-center gap-3">

          {!done ? (
<button

              onClick={skip}

              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
>

              Skip
</button>

          ) : null}
<Link

            href={`/category/${slug}/chat`}

            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
>

            Chat
</Link>
</div>
</div>

      {!done ? (
<div className="mt-6">

          {/* Steps*/}
<div className="flex items-center justify-between text-sm text-slate-500">
<div>

              {step + 1} of {total}
</div>
</div>
<div className="mt-3 h-2 w-full rounded-full bg-slate-200/60 dark:bg-slate-800">
<div

              className="h-2 rounded-full bg-sky-500 transition-all"

              style={{ width: `${progressPct}%` }}

            />
</div>
<h1 className="mt-6 text-3xl font-bold">{currentQ?.question}</h1>

          {/* Cards  */}
<div className="mt-8 grid grid-cols-2 gap-4">

            {currentQ?.options.map((opt) => {

              const active = selected === opt.label;

              return (
<button

                  key={opt.label}

                  onClick={() => setSelected(opt.label)}

                  className={[

                    "relative rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md",

                    "dark:bg-slate-900",

                    active

                      ? "border-sky-400 ring-2 ring-sky-400/40 dark:border-sky-500"

                      : "border-slate-200 dark:border-slate-800",

                  ].join(" ")}
>
<div className="text-2xl">{opt.emoji ?? "✨"}</div>
<div className="mt-3 text-base font-semibold">{opt.label}</div>

                  {/* check bubble*/}

                  {active ? (
<div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white">

                      ✓
</div>

                  ) : null}
</button>

              );

            })}
</div>

          {/* Continue button */}
<button

            onClick={goNext}

            disabled={!selected}

            className={[

              "mt-6 w-full rounded-2xl px-5 py-4 font-semibold shadow",

              selected

                ? "bg-sky-600 text-white hover:bg-sky-700"

                : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400",

            ].join(" ")}
>

            {step === total - 1 ? "See Recommendations" : "Continue"}
</button>
</div>

      ) : (
<div className="mt-6">
<div className="text-sm font-semibold text-sky-400">TrueNorth AI</div>
<h1 className="mt-2 text-3xl font-bold">Based on your preferences</h1>
<div className="mt-3 text-sm text-slate-500">

            Occasion: <span className="text-slate-200">{answers.occasion ?? "—"}</span>{" "}
<span className="mx-2 text-slate-600">|</span>

            Mood: <span className="text-slate-200">{answers.mood ?? "—"}</span>{" "}
<span className="mx-2 text-slate-600">|</span>

            Cuisine: <span className="text-slate-200">{answers.cuisine ?? "—"}</span>{" "}
<span className="mx-2 text-slate-600">|</span>

            Budget: <span className="text-slate-200">{answers.budget ?? "—"}</span>
</div>
<div className="mt-6 space-y-4">

            {recommendations.map((r) => (
<div

                key={r.title}

                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
>
<div className="flex items-center justify-between">
<div>
<div className="text-lg font-semibold">{r.title}</div>
<div className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                      {r.subtitle}
</div>
</div>
<div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">

                    ⭐ {r.rating}
</div>
</div>
<div className="mt-4 flex flex-wrap gap-2">

                  {r.tags.map((t) => (
<span

                      key={t}

                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
>

                      {t}
</span>

                  ))}
</div>
<div className="mt-4 flex items-center gap-3">
<div className="h-2 flex-1 rounded-full bg-slate-200/60 dark:bg-slate-800">
<div

                      className="h-2 rounded-full bg-sky-500"

                      style={{ width: r.match }}

                    />
</div>
<div className="text-sm font-semibold text-slate-500">{r.match}</div>
</div>
</div>

            ))}
</div>
<div className="mt-6 grid gap-3">
<Link

              href={`/category/${slug}/chat`}

              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center font-semibold text-slate-700 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
>

              Continue in Chat
</Link>
<button

              onClick={reset}

              className="w-full rounded-2xl bg-sky-600 px-5 py-4 font-semibold text-white shadow hover:bg-sky-700"
>

              Start Over
</button>
</div>
</div>

      )}
</AppShell>

  );

}
 