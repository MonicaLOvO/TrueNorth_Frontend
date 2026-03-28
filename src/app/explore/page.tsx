"use client";

import AppShell from "@/components/AppShell";
import { readRecentExplores, type StoredExplore } from "@/lib/recent-explores";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BackButton from "@/components/BackButton";

const FILTERS = ["All", "With Link", "With Location"] as const;
type Filter = (typeof FILTERS)[number];

const FALLBACK_EXPLORES: StoredExplore[] = [
  {
    name: "TrueNorth demo result",
    description: "Finish a guided flow or use chat suggestions to populate this screen with live recommendations.",
    url: null,
    location: "No recent backend result yet",
    imageUrl: null,
    savedAt: new Date().toISOString(),
    source: "guided",
    categorySlug: "food",
  },
];

function formatSavedAt(value: string) {
  return new Date(value).toLocaleString();
}

function normalizeUrl(url: string | null) {
  if (!url) {
    return null;
  }
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

export default function ExplorePage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [expandedMap, setExpandedMap] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [explores, setExplores] = useState<StoredExplore[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    const recent = readRecentExplores();
    const items = recent.length > 0 ? recent : FALLBACK_EXPLORES;
    setExplores(items);
    setSelectedName(items[0]?.name ?? null);
  }, []);

  const filtered = useMemo(() => {
    if (filter === "With Link") {
      return explores.filter((explore) => Boolean(explore.url));
    }
    if (filter === "With Location") {
      return explores.filter((explore) => Boolean(explore.location));
    }
    return explores;
  }, [explores, filter]);

  const selectedExplore =
    filtered.find((explore) => explore.name === selectedName) ?? filtered[0] ?? null;

  const websiteUrl = normalizeUrl(selectedExplore?.url ?? null);

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <BackButton href="/home" />
      
        <div className="text-lg font-semibold">Explore</div>
        <button
          className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-slate-200 px-4 text-sm font-medium dark:bg-slate-800"
          aria-label="Refine"
          onClick={() => setShowFilters((value) => !value)}
        >
          {showFilters ? "Hide" : "Refine"}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/20 shadow-sm dark:border-slate-800">
        <div
          className={[
            "relative bg-[linear-gradient(90deg,rgba(56,189,248,0.15),rgba(14,165,233,0.08))] transition-all",
            expandedMap ? "h-64" : "h-40",
          ].join(" ")}
        >
          <div className="absolute left-6 top-6 max-w-[70%] rounded-2xl bg-white/90 p-4 text-sm shadow-sm backdrop-blur dark:bg-slate-900/90">
            <div className="font-semibold">Recent recommendation summary</div>
            <div className="mt-2 text-slate-600 dark:text-slate-400">
              {filtered.length} result{filtered.length === 1 ? "" : "s"} available
            </div>
            {selectedExplore?.categorySlug ? (
              <div className="mt-1 text-slate-500 dark:text-slate-400">
                Category: {selectedExplore.categorySlug}
              </div>
            ) : null}
          </div>

          <button
            className="absolute bottom-4 right-4 rounded-full bg-slate-900/70 px-4 py-2 text-sm text-white backdrop-blur hover:bg-slate-900"
            onClick={() => setExpandedMap((value) => !value)}
          >
            {expandedMap ? "Collapse" : "Expand"} summary
          </button>
        </div>
      </div>

      {showFilters ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((chip) => {
            const active = chip === filter;
            return (
              <button
                key={chip}
                onClick={() => setFilter(chip)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-sky-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
                ].join(" ")}
              >
                {chip}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 text-sm text-slate-500">{filtered.length} saved recommendations</div>

      {selectedExplore ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{selectedExplore.name}</div>
              {selectedExplore.location ? (
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedExplore.location}
                </div>
              ) : null}
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {selectedExplore.source}
            </span>
          </div>

          {selectedExplore.description ? (
            <div className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {selectedExplore.description}
            </div>
          ) : null}

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Saved {formatSavedAt(selectedExplore.savedAt)}
          </div>

          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Open website
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-4 pb-10">
        {filtered.map((explore) => (
          <button
            key={`${explore.name}-${explore.savedAt}`}
            className={[
              "w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:bg-slate-900",
              selectedExplore?.name === explore.name
                ? "border-sky-400 ring-2 ring-sky-400/40 dark:border-sky-500"
                : "border-slate-200 dark:border-slate-800",
            ].join(" ")}
            onClick={() => setSelectedName(explore.name)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{explore.name}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {explore.location ?? "No location provided"}
                </div>
              </div>
              <div className="text-slate-400">›</div>
            </div>
            {explore.description ? (
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {explore.description}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </AppShell>
  );
}