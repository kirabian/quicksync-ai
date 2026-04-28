import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { OfflineIndicator } from "@/components/OfflineIndicator";



const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickSync AI",
  description: "Convert PDFs and text into Notion/Trello notes in 10 seconds using AI.",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${syne.variable} ${outfit.variable} antialiased bg-background text-foreground font-sans`}
      >
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <Providers>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          <Toaster position="bottom-right" richColors />
          <OfflineIndicator />
        </Providers>
      </body>
    </html>
  );
}
