import Link from "next/link";
import AppShell from "@/components/AppShell";
import TrueNorthLogo from "@/components/TrueNorthLogo";

export default function WelcomePage() {
  return (
    <AppShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <TrueNorthLogo size={108} showText={false} priority className="mb-6" />

        <h1 className="text-4xl font-bold tracking-tight">TrueNorth</h1>
        <p className="mt-3 max-w-sm text-slate-600 dark:text-slate-400">
          Your AI compass for <br /> everyday decisions
        </p>

        <Link
          href="/home"
          className="mt-10 w-full max-w-sm rounded-2xl bg-sky-600 px-6 py-4 text-center font-semibold text-white shadow hover:bg-sky-700"
        >
          Get Started
        </Link>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </AppShell>
  );
}