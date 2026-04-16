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
<<<<<<< HEAD
      <AuthProvider>{children}</AuthProvider>
=======
      {children}
>>>>>>> 419318d21465bb7c411e40c91f2598a24a49de9c
    </ThemeProvider>
  );
}