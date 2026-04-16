"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="truenorth-theme"
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}