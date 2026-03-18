import type { ExploreSuggestion } from "@/lib/api";

const RECENT_EXPLORES_KEY = "truenorth:recent-explores";

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

  window.localStorage.setItem(RECENT_EXPLORES_KEY, JSON.stringify(normalized));
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