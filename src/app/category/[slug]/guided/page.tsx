"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useMemo, useState } from "react";

type Q = { id: string; question: string; options: string[] };

export default function GuidedPage({ params }: { params: { slug: string } }) {
  const questions: Q[] = useMemo(() => {
    if (params.slug === "food") {
      return [
        {
          id: "time",
          question: "What time is it?",
          options: ["Breakfast", "Lunch", "Dinner", "Snack"],
        },
        {
          id: "speed",
          question: "How fast do you want it?",
          options: ["5–10 min", "15–25 min", "30+ min"],
        },
        {
          id: "style",
          question: "What are you feeling?",
          options: ["Healthy", "Comfort", "High-protein", "Anything"],
        },
        { id: "budget", question: "Budget?", options: ["$", "$$", "$$$"] },
      ];
    }

    return [
      {
        id: "pref",
        question: "What are you looking for?",
        options: ["Option A", "Option B", "Option C"],
      },
    ];
  }, [params.slug]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const done = step >= questions.length;

  const recommendations = useMemo(() => {
    if (params.slug !== "food") {
      return [
        "Sample recommendation 1",
        "Sample recommendation 2",
        "Sample recommendation 3",
      ];
    }

    const time = answers.time ?? "";
    const style = answers.style ?? "";

    if (time === "Breakfast" && style === "Healthy")
      return ["Greek yogurt + berries", "Egg-white omelet", "Oatmeal + banana"];
    if (style === "Comfort") return ["Mac & cheese", "Burgers", "Ramen"];
    if (style === "High-protein") return ["Chicken bowl", "Steak + rice", "Tuna wrap"];
    return ["Tacos", "Sushi", "Pizza"];
  }, [answers, params.slug]);

  function choose(option: string) {
    const q = questions[step];
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
    setStep((s) => s + 1);
  }

  return (
    <AppShell>
      <Link
        href={`/category/${params.slug}`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Back
      </Link>

      {!done ? (
        <div className="mt-6">
          <div className="text-xs text-slate-500">
            Step {step + 1} of {questions.length}
          </div>

          <h1 className="mt-2 text-2xl font-bold">{questions[step].question}</h1>

          <div className="mt-5 grid gap-3">
            {questions[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => choose(opt)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h1 className="text-2xl font-bold">Recommendations</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Based on your answers, here are some picks:
          </p>

          <div className="mt-5 space-y-3">
            {recommendations.map((r) => (
              <div
                key={r}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {r}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setStep(0);
              setAnswers({});
            }}
            className="mt-6 w-full rounded-2xl bg-sky-600 px-5 py-4 font-semibold text-white shadow hover:bg-sky-700"
          >
            Start Over
          </button>
        </div>
      )}
    </AppShell>
  );
}