"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import { updateCurrentUser, type CurrentUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { readRecentExplores } from "@/lib/recent-explores";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

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

function getInitials(user: Pick<CurrentUser, "DisplayName" | "UserName">) {
  const source = user.DisplayName?.trim() || user.UserName?.trim() || "TN";
  return (
    source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "TN"
  );
}

const DEMO_USER: CurrentUser = {
  Id: "demo-user",
  UserName: "TrueNorth User",
  Email: "demo@truenorth.app",
  DisplayName: "TrueNorth User",
};

export default function ProfilePage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user: authUser, isAuthenticated, logout: authLogout, authState } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingTheme, setSavingTheme] = useState(false);
  const [recentExplores, setRecentExplores] = useState(
    () => [] as ReturnType<typeof readRecentExplores>,
  );
  const [user, setUser] = useState<CurrentUser>(DEMO_USER);

  const loadingUser = authState.status === "loading";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setProfileError(null);
    } else if (authState.status === "unauthenticated") {
      setProfileError("Using demo profile — sign in to see your real profile.");
    }
  }, [authUser, authState.status]);

  useEffect(() => {
    setRecentExplores(readRecentExplores());
  }, []);

  const darkMode = resolvedTheme === "dark";

  const stats = useMemo(
    () => ({
      decisionsMade: Math.max(recentExplores.length, 1),
      exploreSessions: recentExplores.length,
      savedPlaces: recentExplores.filter((item) => Boolean(item.url)).length,
      decisionHistory: recentExplores.length,
    }),
    [recentExplores],
  );

  async function handleThemeToggle() {
    if (!mounted || savingTheme) return;
    setSavingTheme(true);
    setTheme(darkMode ? "light" : "dark");
    setTimeout(() => setSavingTheme(false), 150);
  }

  function handleUseDemoProfile() {
    setProfileError(null);
    setUser(DEMO_USER);
  }

  function handleLogout() {
    authLogout();
    router.push("/login");
  }

  async function handleQuickDisplayNameUpdate() {
    const nextName = window.prompt(
      "Update display name",
      user.DisplayName?.trim() || user.UserName?.trim() || "",
    );

    if (nextName === null) return;

    const trimmed = nextName.trim();
    if (!trimmed) {
      setProfileError("Display name cannot be empty.");
      return;
    }

    try {
      const updated = await updateCurrentUser({ displayName: trimmed });
      setUser(updated);
      setProfileError(null);
    } catch {
      setUser((current) => ({ ...current, DisplayName: trimmed }));
      setProfileError("Saved locally only. Backend profile update is not available for this session.");
    }
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3">
        <BackButton useHistory fallbackHref="/home" />
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="w-[72px]" />
      </div>

      {profileError ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          {profileError}
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
              {getInitials(user)}
            </div>
            <div>
              <div className="text-lg font-semibold">
                {loadingUser ? "Loading profile..." : user.DisplayName || user.UserName}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {user.Email || `${user.UserName}@truenorth.app`}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleQuickDisplayNameUpdate()}
            className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl font-extrabold text-sky-500">{stats.decisionsMade}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Decisions Made</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-3xl font-extrabold text-sky-500">{stats.exploreSessions}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Explore Sessions</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 text-sm font-semibold tracking-wide text-slate-400">
          PREFERENCES
        </div>
        <div className="space-y-3">
          <Row icon="♡" label="Saved Places" value={stats.savedPlaces} href="/explore" />
          <Row icon="🕒" label="Decision History" value={stats.decisionHistory} href="/chat" />
          <Row icon="⚙️" label="Settings" href="/settings" />
          <Row icon="🔔" label="Notifications" href="/settings" />
          <Row icon="🌐" label="Location Settings" href="/settings" />
          <Row
            icon="🌙"
            label="Dark Mode"
            onClick={() => void handleThemeToggle()}
            right={
              <div
                className={[
                  "relative h-6 w-11 rounded-full transition",
                  darkMode ? "bg-sky-600" : "bg-slate-300 dark:bg-slate-700",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute top-1 h-4 w-4 rounded-full bg-white transition",
                    darkMode ? "left-6" : "left-1",
                  ].join(" ")}
                />
              </div>
            }
          />
          <Row icon="❓" label="Help & Support" href="/settings" />
        </div>

        <div className="mt-6 grid gap-3">
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="w-full rounded-2xl bg-sky-600 px-4 py-4 text-center font-semibold text-white shadow hover:bg-sky-700"
            >
              Sign in
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleUseDemoProfile}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Use Demo Profile
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              onClick={handleLogout}
            >
              ⎋ Sign out
            </button>
          ) : (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              onClick={() => router.push("/")}
            >
              ⎋ Return to Welcome Screen
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}