"use client";

import AppShell from "@/components/AppShell";
import BackButton from "@/components/BackButton";
import { readRecentExplores, type StoredExplore } from "@/lib/recent-explores";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FILTERS = ["All", "With Link", "With Location"] as const;
type Filter = (typeof FILTERS)[number];

const FALLBACK_EXPLORES: StoredExplore[] = [
  {
    name: "TrueNorth demo result",
    description:
      "Finish a guided flow or use chat suggestions to populate this screen with live recommendations.",
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

function cleanText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .replace(/\*\*/g, "")
    .replace(/^[\s>*•-]+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getCategoryLabel(slug?: string) {
  if (!slug) {
    return null;
  }

  return CATEGORIES.find((category) => category.slug === slug)?.title ?? slug;
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
  const categoryLabel = getCategoryLabel(selectedExplore?.categorySlug);

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-3">
        <BackButton href="/home" />
        <div className="text-lg font-semibold text-slate-900 dark:text-white">Explore</div>
        <button
          className="flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
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
            {categoryLabel ? (
              <div className="mt-1 text-slate-500 dark:text-slate-400">
                Category: {categoryLabel}
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
              <div className="text-lg font-semibold">
                {cleanText(selectedExplore.name) ?? selectedExplore.name}
              </div>
              {cleanText(selectedExplore.location) ? (
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {cleanText(selectedExplore.location)}
                </div>
              ) : null}
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {selectedExplore.source}
            </span>
          </div>

          {cleanText(selectedExplore.description) ? (
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {cleanText(selectedExplore.description)}
            </div>
          ) : null}

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Saved {formatSavedAt(selectedExplore.savedAt)}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Open website
              </a>
            ) : null}
            {selectedExplore.categorySlug ? (
              <Link
                href={`/category/${selectedExplore.categorySlug}/guided`}
                className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
              >
                Open {getCategoryLabel(selectedExplore.categorySlug)}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-4 space-y-4 pb-10">
        {filtered.map((explore) => {
          const itemUrl = normalizeUrl(explore.url);
          const isActive = selectedExplore?.name === explore.name;
          return (
            <div
              key={`${explore.name}-${explore.savedAt}`}
              className={[
                "rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:bg-slate-900",
                isActive
                  ? "border-sky-400 ring-2 ring-sky-400/40 dark:border-sky-500"
                  : "border-slate-200 dark:border-slate-800",
              ].join(" ")}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setSelectedName(explore.name)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {cleanText(explore.name) ?? explore.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {cleanText(explore.location) ?? "No location provided"}
                    </div>
                  </div>
                  <div className="text-slate-400">›</div>
                </div>
                {cleanText(explore.description) ? (
                  <div className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                    {cleanText(explore.description)}
                  </div>
                ) : null}
              </button>

              <div className="mt-4 flex flex-wrap gap-3">
                {itemUrl ? (
                  <a
                    href={itemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Website
                  </a>
                ) : null}
                {explore.categorySlug ? (
                  <Link
                    href={`/category/${explore.categorySlug}/guided`}
                    className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    Open category
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}