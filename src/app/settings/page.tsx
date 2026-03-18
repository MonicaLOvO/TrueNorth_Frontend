"use client";

import AppShell from "@/components/AppShell";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const activeTheme = resolvedTheme ?? theme;

  return (
    <AppShell>
      <Link href="/home" className="text-sm text-slate-500 hover:underline">
        ← Back
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Settings</h1>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">Theme</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Toggle light and dark mode.
              </div>
            </div>
            <button
              onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
              className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
            >
              {activeTheme === "dark" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="font-semibold">Backend connection</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The frontend currently sends API requests to:
          </div>
          <code className="mt-3 block rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {API_BASE_URL}
          </code>
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Local development defaults to /api, which proxies to the backend on http://localhost:3000. Change BACKEND_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL if your backend runs somewhere else.
          </div>
        </div>
      </div>
    </AppShell>
  );
}