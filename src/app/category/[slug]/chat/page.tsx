"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useState } from "react";

type Msg = { from: "bot" | "user"; text: string };

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hey! Tell me what you're looking for and I’ll suggest some options.",
    },
  ]);
  const [input, setInput] = useState("");

  const quick = ["Something quick", "Date night", "Comfort", "Healthy option"];

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { from: "user", text: trimmed }]);
    setInput("");

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            params.slug === "food"
              ? "Got it. Here are 3 picks: Sushi, Tacos, or a Chicken Bowl. Want cheaper or healthier?"
              : "Got it. Want me to narrow it down by budget, time, or mood?",
        },
      ]);
    }, 350);
  }

  return (
    <AppShell>
      <Link
        href={`/category/${params.slug}`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Back
      </Link>

      <div className="mt-4 text-xl font-semibold">Chat</div>

      <div className="mt-4 space-y-3 pb-28">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              m.from === "user"
                ? "ml-auto bg-sky-600 text-white"
                : "mr-auto border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            }`}
          >
            {m.text}
          </div>
        ))}

        <div className="pt-2">
          <div className="text-xs text-slate-500">Quick suggestions</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0">
        <div className="mx-auto w-full max-w-[560px] px-4">
          <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl bg-transparent px-3 py-2 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
            />
            <button
              onClick={() => send(input)}
              className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}