"use client";
 
import AppShell from "@/components/AppShell";

import BackButton from "@/components/BackButton";

import { CATEGORIES } from "@/lib/categories";

import { type ExploreSuggestion, sendChat } from "@/lib/api";

import { saveRecentExplores } from "@/lib/recent-explores";

import Link from "next/link";

import { useMemo, useState } from "react";
 
type UiMessage = {

  role: "assistant" | "user";

  text: string;

};
 
function normalizeUrl(url: string | null) {

  if (!url) return null;

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
 
export default function DecisionChat({ slug }: { slug?: string }) {

  const category = CATEGORIES.find((item) => item.slug === slug);

  const backHref = slug ? `/category/${slug}/guided` : "/home";

  const heading = category

    ? `${category.emoji} ${category.title} Chat`

    : "TrueNorth Chat";

  const subtitle = category

    ? `AI assistant for ${category.title.toLowerCase()} decisions`

    : "AI decision assistant";
 
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [explores, setExplores] = useState<ExploreSuggestion[]>([]);

  const [messages, setMessages] = useState<UiMessage[]>([

    {

      role: "assistant",

      text: category

        ? `Hi! I can help you decide in ${category.title}. Tell me what you are choosing between, and I will narrow it down with you.`

        : "Hi! I am TrueNorth. Tell me what you are deciding, and I will help you narrow it down.",

    },

  ]);
 
  const quickSuggestions = useMemo(() => {

    if (slug === "food") {

      return [

        "Help me pick dinner tonight",

        "Cheap lunch nearby",

        "Best date night food option",

        "Something quick and easy",

      ];

    }

    return [

      "Help me decide what to do tonight",

      "Pick between two options",

      "Give me a few strong recommendations",

      "Help me narrow this down",

    ];

  }, [slug]);
 
  async function submitMessage(text: string) {

    const trimmed = text.trim();

    if (!trimmed || loading) return;
 
    const nextMessages: UiMessage[] = [...messages, { role: "user", text: trimmed }];

    setMessages(nextMessages);

    setInput("");

    setLoading(true);

    setError(null);
 
    try {

      const response = await sendChat([

        ...(category

          ? [

              {

                role: "user" as const,

                content: `Context: We are making a decision in the ${category.title} category.`,

              },

            ]

          : []),

        ...nextMessages.map((message) => ({

          role: message.role,

          content: message.text,

        })),

      ]);
 
      const reply =

        cleanText(response.message)?.trim() ||

        "I did not get a useful reply back from the backend.";

      setMessages([...nextMessages, { role: "assistant", text: reply }]);

      setExplores(response.explores ?? []);
 
      if ((response.explores ?? []).length > 0) {

        saveRecentExplores(response.explores, {

          source: "chat",

          categorySlug: slug,

        });

      }

    } catch (caughtError) {

      const message =

        caughtError instanceof Error

          ? caughtError.message

          : "Something went wrong while contacting the backend.";

      setError(message);

      setMessages([

        ...nextMessages,

        {

          role: "assistant",

          text: "I could not reach the backend just now. Check that the backend server is running and try again.",

        },

      ]);

    } finally {

      setLoading(false);

    }

  }
 
  return (
<AppShell>
<BackButton href={backHref} />
 
      <div className="mb-4 mt-5">
<div className="text-xl font-bold text-slate-900 dark:text-white">{heading}</div>
<div className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>
</div>
 
      <div className="space-y-3">

        {messages.map((message, index) => (
<div

            key={`${message.role}-${index}`}

            className={[

              "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",

              message.role === "assistant"

                ? "border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"

                : "ml-auto bg-sky-600 text-white shadow-sm shadow-sky-600/20",

            ].join(" ")}
>

            {message.text}
</div>

        ))}

        {loading && (
<div className="max-w-[88%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            Thinking...
</div>

        )}
</div>
 
      <div className="mt-5">
<div className="text-xs font-semibold uppercase tracking-widest text-slate-400">

          Quick suggestions
</div>
<div className="mt-2 flex flex-wrap gap-2">

          {quickSuggestions.map((suggestion) => (
<button

              key={suggestion}

              onClick={() => void submitMessage(suggestion)}

              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-600"
>

              {suggestion}
</button>

          ))}
</div>
</div>
 
      {error ? (
<div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">

          {error}
</div>

      ) : null}
 
      {explores.length > 0 ? (
<div className="mt-5">
<div className="flex items-center justify-between gap-3">
<div className="text-xs font-semibold uppercase tracking-widest text-slate-400">

              Suggested options
</div>
<Link href="/explore" className="text-sm font-medium text-sky-600 hover:underline">

              View all
</Link>
</div>
<div className="mt-2 space-y-3">

            {explores.slice(0, 3).map((explore) => {

              const websiteUrl = normalizeUrl(explore.url);

              return (
<div

                  key={`${explore.name}-${explore.url ?? explore.location ?? "card"}`}

                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
>
<div className="text-base font-semibold">

                    {cleanText(explore.name) ?? explore.name}
</div>

                  {cleanText(explore.description) ? (
<div className="mt-1 text-sm text-slate-600 dark:text-slate-400">

                      {cleanText(explore.description)}
</div>

                  ) : null}

                  {cleanText(explore.location) ? (
<div className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                      {cleanText(explore.location)}
</div>

                  ) : null}
<div className="mt-3 flex flex-wrap gap-3">

                    {websiteUrl ? (
<a

                        href={websiteUrl}

                        target="_blank"

                        rel="noreferrer"

                        className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
>

                        Open website
</a>

                    ) : null}
<Link

                      href="/explore"

                      className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
>

                      View details
</Link>
</div>
</div>

              );

            })}
</div>
</div>

      ) : null}
 
      <div className="mt-5 mb-24 flex items-center gap-2">
<div className="flex flex-1 items-center rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
<input

            value={input}

            onChange={(event) => setInput(event.target.value)}

            onKeyDown={(event) => {

              if (event.key === "Enter") void submitMessage(input);

            }}

            placeholder="Type your message..."

            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"

          />
</div>
<button

          onClick={() => void submitMessage(input)}

          disabled={loading || !input.trim()}

          className={[

            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition active:scale-95",

            loading || !input.trim()

              ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"

              : "bg-sky-600 text-white shadow-sky-600/30 hover:bg-sky-700",

          ].join(" ")}

          aria-label="Send"
>

          {loading ? "..." : "↑"}
</button>
</div>
</AppShell>

  );

}
 
