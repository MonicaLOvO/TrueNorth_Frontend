import type { ExploreSuggestion } from "@/lib/api";

const RECENT_EXPLORES_KEY = "truenorth:recent-explores";
const MAX_RECENT_EXPLORES = 24;

export type StoredExplore = ExploreSuggestion & {
  savedAt: string;
  source: "guided" | "chat";
  categorySlug?: string;
};

function normalizeOptional(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.toLowerCase() === "n/a") {
    return null;
  }
  return trimmed;
}

function getExploreKey(
  explore: Pick<StoredExplore, "name" | "url" | "location" | "categorySlug">,
) {
  return [
    explore.name.trim().toLowerCase(),
    normalizeOptional(explore.url)?.toLowerCase() ?? "",
    normalizeOptional(explore.location)?.toLowerCase() ?? "",
    explore.categorySlug ?? "",
  ].join("|");
}

export function saveRecentExplores(
  explores: ExploreSuggestion[],
  meta: { source: "guided" | "chat"; categorySlug?: string },
) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized: StoredExplore[] = explores.map((explore) => ({
    name: explore.name,
    description: normalizeOptional(explore.description),
    url: normalizeOptional(explore.url),
    location: normalizeOptional(explore.location),
    imageUrl: normalizeOptional(explore.imageUrl),
    savedAt: new Date().toISOString(),
    source: meta.source,
    categorySlug: meta.categorySlug,
  }));

  const existing = readRecentExplores();
  const merged = [...normalized, ...existing];
  const unique = new Map<string, StoredExplore>();

  for (const item of merged) {
    const key = getExploreKey(item);
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  window.localStorage.setItem(
    RECENT_EXPLORES_KEY,
    JSON.stringify(Array.from(unique.values()).slice(0, MAX_RECENT_EXPLORES)),
  );
}

export function readRecentExplores(): StoredExplore[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(RECENT_EXPLORES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as StoredExplore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}