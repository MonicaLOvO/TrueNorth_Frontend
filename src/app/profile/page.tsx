"use client";

import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type RowProps = {
  icon: string;
  label: string;
  value?: string | number;
  href?: string;
  onClick?: () => void;
  right?: React.ReactNode;
};

function Row({ icon, label, value, href, onClick, right }: RowProps) {
  const content = (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-800">
          {icon}
        </div>
        <div className="font-semibold">{label}</div>
      </div>
      <div className="flex items-center gap-3">
        {value !== undefined ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {value}
          </span>
        ) : null}
        {right ? right : <span className="text-slate-400">›</span>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" className="w-full text-left" onClick={onClick}>
      {content}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const user = useMemo(
    () => ({
      initials: "TN",
      name: "TrueNorth User",
      email: "demo@truenorth.app",
      decisionsMade: 12,
      placesVisited: 5,
      savedPlaces: 3,
      decisionHistory: 8,
    }),
    [],
  );

  const darkMode = resolvedTheme === "dark";

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link
          href="/settings"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800"
          aria-label="Settings"
        >
          ⚙️
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
              {user.initials}
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
            </div>
          </div>
          <Link
            href="/settings"
            className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl font-extrabold text-sky-500">{user.decisionsMade}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Decisions Made</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl font-extrabold text-sky-500">{user.placesVisited}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Explore Sessions</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 text-sm font-semibold tracking-wide text-slate-400">PREFERENCES</div>
        <div className="space-y-3">
          <Row icon="♡" label="Saved Places" value={user.savedPlaces} href="/explore" />
          <Row icon="🕒" label="Decision History" value={user.decisionHistory} href="/chat" />
          <Row icon="🔔" label="Notifications" href="/settings" />
          <Row icon="🌐" label="Location Settings" href="/settings" />
          <Row
            icon="🌙"
            label="Dark Mode"
            onClick={() => setTheme(darkMode ? "light" : "dark")}
            right={
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={darkMode}
                  onChange={() => setTheme(darkMode ? "light" : "dark")}
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div
                  className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition ${
                    darkMode ? "translate-x-5" : ""
                  }`}
                />
              </label>
            }
          />
          <Row icon="❓" label="Help & Support" href="/settings" />
        </div>

        <button
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          onClick={() => router.push("/")}
        >
          ⎋ Return to Welcome Screen
        </button>
      </div>
    </AppShell>
  );
}