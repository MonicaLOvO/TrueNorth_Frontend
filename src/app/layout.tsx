import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrueNorth",
  description: "Your AI compass for everyday decisions",
  icons: {
    icon: "/truenorth-compass.png",
    shortcut: "/truenorth-compass.png",
    apple: "/truenorth-compass.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}