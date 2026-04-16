"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout as apiLogout, isLoggedIn, type CurrentUser } from "@/lib/api";

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: CurrentUser }
  | { status: "unauthenticated" };

type AuthContextValue = {
  authState: AuthState;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) {
      setAuthState({ status: "unauthenticated" });
      return;
    }
    try {
      const user = await getCurrentUser();
      setAuthState({ status: "authenticated", user });
    } catch {
      setAuthState({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    apiLogout();
    setAuthState({ status: "unauthenticated" });
  }, []);

  const value: AuthContextValue = {
    authState,
    user: authState.status === "authenticated" ? authState.user : null,
    isAuthenticated: authState.status === "authenticated",
    refresh,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}