import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import { AuthProvider } from "@/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PromptForge AI",
    template: "%s | PromptForge AI",
  },
  description:
    "Transform vague ideas into structured, production-ready AI prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-[family-name:var(--font-geist-sans)] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}