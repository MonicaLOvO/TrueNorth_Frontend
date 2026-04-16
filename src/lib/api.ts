import { CATEGORIES } from "@/lib/categories";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api";

export type ApiCategory = {
  id: string;
  name: string;
  iconUrl: string | null;
  description: string | null;
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

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
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

export async function ensureCategory(slug: string): Promise<ApiCategory> {
  const definition = getCategoryDefinition(slug);
  const desiredName = definition?.title ?? fallbackCategoryName(slug);

  const categories = await apiRequest<ApiCategory[]>("/categories");
  const existing = categories.find((category) => {
    const normalized = normalizeCategoryName(category.name);
    return (
      normalized === normalizeCategoryName(desiredName) ||
      normalized === normalizeCategoryName(slug)
    );
  });

  if (existing) {
    return existing;
  }

  return apiRequest<ApiCategory>("/categories", {
    method: "POST",
    body: JSON.stringify({
      name: desiredName,
      description: definition?.subtitle ?? `Decisions about ${desiredName}`,
      iconUrl: null,
    }),
  });
}

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

export async function sendChat(
  messages: ChatRequestMessage[],
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/decisions/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });

  // ── Auth ────────────────────────────────────────────────────────────────────

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