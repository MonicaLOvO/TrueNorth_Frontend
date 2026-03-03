import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-[520px] px-4 py-10">
        {children}
      </div>
    </main>
  );
}