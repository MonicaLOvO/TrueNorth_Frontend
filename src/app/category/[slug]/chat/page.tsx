"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
type Msg = { role: "assistant" | "user"; text: string };
export default function ChatPage() {
 const params = useParams();
 const slug = (params?.slug as string) || "food";
 const [input, setInput] = useState("");
 const [messages, setMessages] = useState<Msg[]>([
   {
     role: "assistant",
     text: "Hi there! I'm TrueNorth, your AI decision assistant.\nWhat would you like help deciding today?",
   },
 ]);
 const quick = useMemo(
   () => [
     "Help me pick dinner",
     "Movie for tonight",
     "Weekend activity",
     "What to read",
   ],
   []
 );
 function send(text: string) {
   const t = text.trim();
   if (!t) return;
   setMessages((prev) => [...prev, { role: "user", text: t }]);
   setInput("");
   // Placeholder assistant reply (later connect real AI)
   setTimeout(() => {
     setMessages((prev) => [
       ...prev,
       {
         role: "assistant",
         text: `Got it. Tell me one more detail (budget, distance, or vibe) and I’ll refine suggestions for "${t}".`,
       },
     ]);
   }, 300);
 }
 return (
<AppShell>
     {/* Back to category mode picker */}
<Link
       href={`/category/${slug}`}
       className="text-sm text-slate-500 hover:underline"
>
       ← Back
</Link>
     {/* Chat card */}
<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="text-lg font-semibold">TrueNorth</div>
<div className="text-sm text-slate-500 dark:text-slate-400">
         AI Assistant
</div>
       {/* Messages */}
<div className="mt-5 space-y-3">
         {messages.map((m, i) => (
<div
             key={i}
             className={[
               "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
               m.role === "assistant"
                 ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                 : "ml-auto bg-sky-600 text-white",
             ].join(" ")}
>
             {m.text}
</div>
         ))}
</div>
       {/* Quick suggestions */}
<div className="mt-6">
<div className="text-xs font-semibold tracking-wide text-slate-500">
           Quick suggestions
</div>
<div className="mt-3 flex flex-wrap gap-2">
           {quick.map((q) => (
<button
               key={q}
               onClick={() => send(q)}
               className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
>
               {q}
</button>
           ))}
</div>
</div>
       {/* Input row */}
<div className="mt-6 flex items-center gap-3">
<div className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
<input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === "Enter") send(input);
             }}
             placeholder="Type your message..."
             className="w-full bg-transparent text-sm outline-none"
           />
</div>
<button
           onClick={() => send(input)}
           className="h-12 w-12 rounded-full bg-slate-200 text-slate-700 shadow-sm hover:shadow-md dark:bg-slate-800 dark:text-slate-200"
           aria-label="Send"
           title="Send"
>
           ➤
</button>
</div>
</div>
</AppShell>
 );
}