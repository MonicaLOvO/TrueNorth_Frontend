import { CATEGORIES } from "@/lib/categories";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api";

export type ApiCategory = {
  id: string;
  name: string;
  iconUrl: string | null;
  description: string | null;
};

export type CreateCategoryPayload = {
  name: string;
  iconUrl?: string | null;
  description?: string | null;
};

export type ApiChat = {
  Id: string;
  UserId?: string | null;
  CategoryId?: string;
};

export type QuestionOption = {
  id: string;
  label: string;
  sortOrder: number;
};

export type GuidedQuestion = {
  id: string;
  conversationId: string;
  prompt: string;
  isCarried: boolean;
  options: QuestionOption[];
};

export type ExploreSuggestion = {
  name: string;
  description: string | null;
  url: string | null;
  location: string | null;
  imageUrl: string | null;
};

export type GuidedLifecycleResponse = {
  chatId: string;
  stage: "start" | "next" | "skip" | "finalize";
  message: string;
  question?: GuidedQuestion;
  explores: ExploreSuggestion[];
};

export type ChatRequestMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  message: string;
  explores: ExploreSuggestion[];
};

export type AudioChatResponse = {
  transcript: string;
  message: string;
  explores: ExploreSuggestion[];
};

export type CurrentUser = {
  Id: string;
  UserName: string;
  Email?: string | null;
  DisplayName?: string | null;
};

export type UpdateCurrentUserPayload = {
  userName?: string;
  email?: string | null;
  displayName?: string | null;
};

// ── Auth types ───────────────────────────────────────────────────────────────

export type LoginPayload = {
  userName: string;
  password: string;
};

export type RegisterPayload = {
  userName: string;
  email: string;
  password: string;
  displayName?: string;
};

export type AuthResponse = {
  access_token: string;
  user: CurrentUser;
};

// ── Token helpers ────────────────────────────────────────────────────────────

let categoriesPromise: Promise<ApiCategory[]> | null = null;

function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const directKeys = [
    "truenorth:access_token",
    "access_token",
    "token",
    "authToken",
    "jwt",
  ];

  for (const key of directKeys) {
    const value =
      window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (value?.trim()) {
      return value.trim();
    }
  }

  const jsonKeys = ["truenorth:auth", "auth", "user", "session"];
  for (const key of jsonKeys) {
    const raw =
      window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as {
        access_token?: string;
        accessToken?: string;
        token?: string;
      };

      const token = parsed.access_token ?? parsed.accessToken ?? parsed.token;
      if (token?.trim()) {
        return token.trim();
      }
    } catch {
      // ignore invalid JSON blobs
    }
  }

  return null;
}

// ── Core request helper ──────────────────────────────────────────────────────

async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  options?: { auth?: boolean },
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(options?.auth && getStoredAccessToken()
          ? { Authorization: `Bearer ${getStoredAccessToken()}` }
          : {}),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Could not reach the TrueNorth backend through ${API_BASE_URL}. Start the backend, or set NEXT_PUBLIC_API_BASE_URL / BACKEND_API_BASE_URL correctly.`,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message)) {
        message = payload.message.join(", ");
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      // ignore JSON parse failures and keep the fallback message
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

// ── Category helpers ─────────────────────────────────────────────────────────

function normalizeCategoryName(value: string) {
  return value.trim().toLowerCase();
}

function getCategoryDefinition(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}

function fallbackCategoryName(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// ── Category API ─────────────────────────────────────────────────────────────

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<ApiCategory> {
  const created = await apiRequest<ApiCategory>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  categoriesPromise = null;
  return created;
}

export async function getCategories(forceRefresh = false): Promise<ApiCategory[]> {
  if (!categoriesPromise || forceRefresh) {
    categoriesPromise = apiRequest<ApiCategory[]>("/categories");
  }

  try {
    return await categoriesPromise;
  } catch (error) {
    categoriesPromise = null;
    throw error;
  }
}

export async function ensureCategory(slug: string): Promise<ApiCategory> {
  const definition = getCategoryDefinition(slug);
  const desiredName = definition?.title ?? fallbackCategoryName(slug);
  const normalizedDesiredName = normalizeCategoryName(desiredName);
  const normalizedSlug = normalizeCategoryName(slug);

  const categories = await getCategories();

  const existing = categories.find((category) => {
    const normalized = normalizeCategoryName(category.name);
    return normalized === normalizedDesiredName || normalized === normalizedSlug;
  });

  if (existing) {
    return existing;
  }

  try {
    const created = await createCategory({
      name: desiredName,
      description: definition?.subtitle ?? null,
      iconUrl: null,
    });

    return created;
  } catch (creationError) {
    const refreshedCategories = await getCategories(true);
    const retryMatch = refreshedCategories.find((category) => {
      const normalized = normalizeCategoryName(category.name);
      return normalized === normalizedDesiredName || normalized === normalizedSlug;
    });

    if (retryMatch) {
      return retryMatch;
    }

    if (creationError instanceof Error) {
      throw new Error(`Unable to prepare the ${desiredName} category. ${creationError.message}`);
    }

    throw new Error(`Unable to prepare the ${desiredName} category.`);
  }
}

// ── Chat & decisions API ─────────────────────────────────────────────────────

export async function createChat(categoryId: string): Promise<ApiChat> {
  return apiRequest<ApiChat>("/chats", {
    method: "POST",
    body: JSON.stringify({
      categoryId,
      userId: null,
    }),
  });
}

export async function startGuided(chatId: string): Promise<GuidedLifecycleResponse> {
  return apiRequest<GuidedLifecycleResponse>(`/decisions/guided/start/${chatId}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function nextGuided(
  chatId: string,
  payload: {
    questionId?: string;
    optionId?: string;
    answerKey?: string;
    answerValue?: string;
  },
): Promise<GuidedLifecycleResponse> {
  return apiRequest<GuidedLifecycleResponse>(`/decisions/guided/next/${chatId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function skipGuided(
  chatId: string,
  payload: {
    questionId?: string;
    questionContext?: string;
    reason?: string;
  },
): Promise<GuidedLifecycleResponse> {
  return apiRequest<GuidedLifecycleResponse>(`/decisions/guided/skip/${chatId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function finalizeGuided(
  chatId: string,
  answers: Record<string, string>,
): Promise<GuidedLifecycleResponse> {
  return apiRequest<GuidedLifecycleResponse>(`/decisions/guided/finalize/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export async function sendChat(messages: ChatRequestMessage[]): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/decisions/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
}

export async function sendAudioChat(
  audioFile: File,
  messages?: ChatRequestMessage[],
): Promise<AudioChatResponse> {
  const formData = new FormData();
  formData.append("audio", audioFile);

  if (messages && messages.length > 0) {
    formData.append("messages", JSON.stringify(messages));
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/decisions/chat/audio`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      `Could not reach the TrueNorth backend through ${API_BASE_URL}. Start the backend, or set NEXT_PUBLIC_API_BASE_URL / BACKEND_API_BASE_URL correctly.`,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(payload.message)) {
        message = payload.message.join(", ");
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      // ignore JSON parse failures and keep the fallback message
    }

    throw new Error(message);
  }

  return (await response.json()) as AudioChatResponse;
}

// ── User API ─────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/auth/me", undefined, { auth: true });
}

export async function updateCurrentUser(
  payload: UpdateCurrentUserPayload,
): Promise<CurrentUser> {
  return apiRequest<CurrentUser>(
    "/auth/me",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    { auth: true },
  );
}

// ── Auth API ─────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (response.access_token) {
    localStorage.setItem("truenorth:access_token", response.access_token);
  }
  return response;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (response.access_token) {
    localStorage.setItem("truenorth:access_token", response.access_token);
  }
  return response;
}

export function logout(): void {
  localStorage.removeItem("truenorth:access_token");
  sessionStorage.removeItem("truenorth:access_token");
}

export function isLoggedIn(): boolean {
  return Boolean(getStoredAccessToken());
}