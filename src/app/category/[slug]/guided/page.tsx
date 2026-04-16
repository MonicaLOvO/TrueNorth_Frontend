"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import {
  type ExploreSuggestion,
  type GuidedQuestion,
  createChat,
  ensureCategory,
  finalizeGuided,
  nextGuided,
  skipGuided,
  startGuided,
} from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { saveRecentExplores } from "@/lib/recent-explores";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_GUIDED_QUESTIONS = 4;

type HistoryItem = {
  prompt: string;
  answer: string;
};

function buildAnswerKey(prompt: string, index: number) {
  const sanitized = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

  return sanitized || `answer-${index}`;
}

function normalizeUrl(url: string | null) {
  if (!url) {
    return null;
  }

  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

function cleanText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .replace(/\*\*/g, "")
    .replace(/^[\s>*•-]+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getGuidedDisplayMessage(response: {
  question?: GuidedQuestion;
  explores?: ExploreSuggestion[];
}) {
  if (response.question) {
    return "";
  }

  if ((response.explores ?? []).length > 0) {
    return "Here are some recommendations based on your answers.";
  }

  return "";
}

export default function GuidedPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "food";
  const category = CATEGORIES.find((item) => item.slug === slug);

  const [refreshKey, setRefreshKey] = useState(0);
  const [chatId, setChatId] = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<GuidedQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [results, setResults] = useState<ExploreSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initializeGuidedFlow() {
      setLoading(true);
      setError(null);
      setChatId(null);
      setAssistantMessage("");
      setCurrentQuestion(null);
      setAnswers({});
      setHistory([]);
      setSelectedOptionId(null);
      setResults([]);

      try {
        const existingCategory = await ensureCategory(slug);
        const chat = await createChat(existingCategory.id);
        const response = await startGuided(chat.Id);

        if (cancelled) {
          return;
        }

        setChatId(chat.Id);
        setAssistantMessage(getGuidedDisplayMessage(response));
        setCurrentQuestion(response.question ?? null);
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to start the guided flow.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeGuidedFlow();

    return () => {
      cancelled = true;
    };
  }, [slug, refreshKey]);

  const selectedOption = useMemo(
    () => currentQuestion?.options.find((option) => option.id === selectedOptionId) ?? null,
    [currentQuestion, selectedOptionId],
  );

  const answeredCount = history.length;
  const progressPct = currentQuestion
    ? Math.min(Math.round(((answeredCount + 1) / MAX_GUIDED_QUESTIONS) * 100), 100)
    : 100;

  async function finalizeWithAnswers(
    finalAnswers: Record<string, string>,
    updatedHistory?: HistoryItem[],
  ) {
    if (!chatId) {
      return;
    }

    const response = await finalizeGuided(chatId, finalAnswers);

    setAnswers(finalAnswers);
    setHistory(updatedHistory ?? history);
    setAssistantMessage(getGuidedDisplayMessage(response));
    setCurrentQuestion(null);
    setSelectedOptionId(null);
    setResults(response.explores ?? []);

    if ((response.explores ?? []).length > 0) {
      saveRecentExplores(response.explores, {
        source: "guided",
        categorySlug: slug,
      });
    }
  }

  async function handleContinue() {
    if (!chatId || !currentQuestion || !selectedOption) {
      return;
    }

    const answerKey = buildAnswerKey(currentQuestion.prompt, answeredCount + 1);
    const nextAnswers = {
      ...answers,
      [answerKey]: selectedOption.label,
    };
    const nextHistory = [
      ...history,
      {
        prompt: currentQuestion.prompt,
        answer: selectedOption.label,
      },
    ];

    setSubmitting(true);
    setError(null);

    try {
      if (nextHistory.length >= MAX_GUIDED_QUESTIONS) {
        await finalizeWithAnswers(nextAnswers, nextHistory);
        return;
      }

      const response = await nextGuided(chatId, {
        questionId: currentQuestion.id,
        optionId: selectedOption.id,
        answerKey,
        answerValue: selectedOption.label,
      });

      setAnswers(nextAnswers);
      setHistory(nextHistory);
      setAssistantMessage(getGuidedDisplayMessage(response));
      setCurrentQuestion(response.question ?? null);
      setSelectedOptionId(null);

      if (!response.question) {
        await finalizeWithAnswers(nextAnswers, nextHistory);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to continue the guided flow.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFinishNow() {
    if (!chatId) {
      return;
    }

    let finalAnswers = answers;
    let finalHistory = history;

    if (currentQuestion && selectedOption) {
      const answerKey = buildAnswerKey(currentQuestion.prompt, answeredCount + 1);
      finalAnswers = {
        ...answers,
        [answerKey]: selectedOption.label,
      };
      finalHistory = [
        ...history,
        {
          prompt: currentQuestion.prompt,
          answer: selectedOption.label,
        },
      ];
    }

    if (Object.keys(finalAnswers).length === 0) {
      setError("Choose at least one answer before generating recommendations.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await finalizeWithAnswers(finalAnswers, finalHistory);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to finalize guided recommendations.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSkip() {
    if (!chatId || !currentQuestion) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await skipGuided(chatId, {
        questionId: currentQuestion.id,
        questionContext: currentQuestion.prompt,
        reason: "User skipped this question",
      });

      setAssistantMessage(getGuidedDisplayMessage(response));
      setCurrentQuestion(response.question ?? null);
      setSelectedOptionId(null);

      if (!response.question && Object.keys(answers).length > 0) {
        await finalizeWithAnswers(answers, history);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Unable to skip this question.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <BackButton href="/home" />
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-semibold">Starting guided flow...</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Creating the chat session and loading your first question.
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <BackButton href="/home" />

        <div className="text-right">
          <div className="text-sm font-semibold text-sky-600 dark:text-sky-400">Guided mode</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {category ? `${category.emoji} ${category.title}` : "TrueNorth"}
          </div>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {assistantMessage ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {assistantMessage}
        </div>
      ) : null}

      {currentQuestion ? (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>
              {Math.min(answeredCount + 1, MAX_GUIDED_QUESTIONS)} of {MAX_GUIDED_QUESTIONS}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => void handleSkip()}
                disabled={submitting}
                className="font-medium text-slate-500 hover:text-slate-700 disabled:opacity-60 dark:hover:text-slate-200"
              >
                Skip
              </button>
              <button
                onClick={() => setRefreshKey((value) => value + 1)}
                className="font-medium text-sky-600 hover:underline"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-slate-200/60 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-sky-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <h1 className="mt-6 text-3xl font-bold">{currentQuestion.prompt}</h1>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const active = selectedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={[
                    "relative rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:bg-slate-900",
                    active
                      ? "border-sky-400 ring-2 ring-sky-400/40 dark:border-sky-500"
                      : "border-slate-200 dark:border-slate-800",
                  ].join(" ")}
                >
                  <div className="text-base font-semibold">{option.label}</div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Tap to select this option.
                  </div>
                  {active ? (
                    <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white">
                      ✓
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3">
            <button
              onClick={() => void handleContinue()}
              disabled={!selectedOption || submitting}
              className={[
                "w-full rounded-2xl px-5 py-4 font-semibold shadow",
                selectedOption && !submitting
                  ? "bg-sky-600 text-white hover:bg-sky-700"
                  : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
              ].join(" ")}
            >
              {submitting
                ? "Working..."
                : answeredCount + 1 >= MAX_GUIDED_QUESTIONS
                  ? "See Recommendations"
                  : "Continue"}
            </button>

            {Object.keys(answers).length > 0 || selectedOption ? (
              <button
                onClick={() => void handleFinishNow()}
                disabled={submitting}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700 shadow-sm hover:shadow-md disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                Finish Now
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-6">
          <div className="text-sm font-semibold text-sky-500">TrueNorth Recommendations</div>
          <h1 className="mt-2 text-3xl font-bold">Based on your answers</h1>

          {history.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your selections
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {history.map((item) => (
                  <div key={`${item.prompt}-${item.answer}`}>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {item.prompt}
                    </span>{" "}
                    — {item.answer}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {results.map((result) => {
              const websiteUrl = normalizeUrl(result.url);

              return (
                <div
                  key={`${result.name}-${result.url ?? result.location ?? "result"}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">
                        {cleanText(result.name) ?? result.name}
                      </div>
                      {cleanText(result.location) ? (
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {cleanText(result.location)}
                        </div>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                      Suggested
                    </span>
                  </div>

                  {cleanText(result.description) ? (
                    <div className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {cleanText(result.description)}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {websiteUrl ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                      >
                        Open website
                      </a>
                    ) : null}
                    <Link
                      href="/explore"
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      View in Explore
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Want a different mode?
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href={`/category/${slug}/chat`}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
          >
            Open Chat
          </Link>
          <Link
            href={`/category/${slug}/voice`}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
          >
            Open Voice
          </Link>
        </div>
      </div>
    </AppShell>
  );
}