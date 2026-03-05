"use client";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { useMemo, useState } from "react";
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
 if (href) return <Link href={href}>{content}</Link>;
 return (
<button type="button" className="w-full text-left" onClick={onClick}>
     {content}
</button>
 );
}
export default function ProfilePage() {
 // Mock user data (replace later with real auth/user state)
 const user = useMemo(
   () => ({
     initials: "JD",
     name: "John Doe",
     email: "john.doe@email.com",
     decisionsMade: 156,
     placesVisited: 23,
     savedPlaces: 12,
     decisionHistory: 48,
   }),
   []
 );
 const [darkMode, setDarkMode] = useState(false);
 //  dark mode by toggling the `dark` class on <html>
 // Your app may already handle theme in providers.tsx; if so, we’ll wire it properly later.
 function toggleDarkMode() {
   setDarkMode((v) => !v);
   const html = document.documentElement;
   html.classList.toggle("dark");
 }
 return (
<AppShell>
<div className="flex items-center justify-between">
<h1 className="text-3xl font-bold">Profile</h1>
       {/* Settings icon (optional) */}
<Link
         href="/settings"
         className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800"
         aria-label="Settings"
>
         ⚙️
</Link>
</div>
     {/* User card */}
<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
             {user.initials}
</div>
<div>
<div className="text-lg font-semibold">{user.name}</div>
<div className="text-sm text-slate-500 dark:text-slate-400">
               {user.email}
</div>
</div>
</div>
<button className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
           Edit
</button>
</div>
</div>
     {/* Stats */}
<div className="mt-5 grid grid-cols-2 gap-4">
<div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="text-3xl font-extrabold text-sky-500">
           {user.decisionsMade}
</div>
<div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
           Decisions Made
</div>
</div>
<div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="text-3xl font-extrabold text-sky-500">
           {user.placesVisited}
</div>
<div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
           Places Visited
</div>
</div>
</div>
     {/* Preferences list */}
<div className="mt-8">
<div className="mb-3 text-sm font-semibold tracking-wide text-slate-400">
         PREFERENCES
</div>
<div className="space-y-3">
<Row icon="♡" label="Saved Places" value={user.savedPlaces} href="/saved" />
<Row
           icon="🕒"
           label="Decision History"
           value={user.decisionHistory}
           href="/history"
         />
<Row icon="🔔" label="Notifications" href="/notifications" />
<Row icon="🌐" label="Location Settings" href="/location" />
<Row
           icon="🌙"
           label="Dark Mode"
           right={
<label className="relative inline-flex cursor-pointer items-center">
<input
                 type="checkbox"
                 className="sr-only"
                 checked={darkMode}
                 onChange={toggleDarkMode}
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
<Row icon="❓" label="Help & Support" href="/support" />
</div>
       {/* Sign out */}
<button
         className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
         onClick={() => alert("Sign out (wire this to auth later)")}
>
         ⎋ Sign Out
</button>
</div>
</AppShell>
 );
}