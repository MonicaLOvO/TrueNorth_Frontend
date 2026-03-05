"use client";
import AppShell from "@/components/AppShell";
import Link from "next/link";
export default function ChatPage() {
 return (
<AppShell>
     {/* Header */}
<div className="flex items-center gap-3">
<Link
         href="/home"
         className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800"
>
         ←
</Link>
<div>
<div className="font-semibold text-lg">TrueNorth</div>
<div className="text-sm text-slate-500">AI Assistant</div>
</div>
</div>
     {/* Chat bubble */}
<div className="mt-6">
<div className="max-w-[80%] rounded-2xl bg-slate-200 px-4 py-3 text-sm dark:bg-slate-800">
         Hi there! I'm TrueNorth, your AI decision assistant.
         What would you like help deciding today?
</div>
</div>
     {/* Quick suggestions */}
<div className="mt-6">
<div className="text-sm text-slate-500">Quick suggestions</div>
<div className="mt-3 flex flex-wrap gap-2">
<button className="rounded-full bg-slate-200 px-4 py-2 text-sm dark:bg-slate-800">
           Help me pick dinner
</button>
<button className="rounded-full bg-slate-200 px-4 py-2 text-sm dark:bg-slate-800">
           Movie for tonight
</button>
<button className="rounded-full bg-slate-200 px-4 py-2 text-sm dark:bg-slate-800">
           Weekend activity
</button>
<button className="rounded-full bg-slate-200 px-4 py-2 text-sm dark:bg-slate-800">
           What to read
</button>
</div>
</div>
     {/* Message input */}
<div className="mt-8 flex items-center gap-2">
<input
         placeholder="Type your message..."
         className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
       />
<button className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white">
         ➤
</button>
</div>
</AppShell>
 );
}