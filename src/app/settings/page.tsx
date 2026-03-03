"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AppShell>
      <Link href="/home" className="text-sm text-slate-500 hover:underline">
        ← Back
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Settings</h1>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Theme</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Toggle light/dark mode
            </div>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
          >
            {theme === "dark" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}