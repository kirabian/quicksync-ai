import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { OfflineIndicator } from "@/components/OfflineIndicator";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
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
        className={`${inter.variable} ${outfit.variable} antialiased bg-zinc-50 dark:bg-zinc-950 font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="py-3 px-6 md:px-12 flex items-center justify-between border-b bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-heading tracking-tight text-primary">QuickSync AI</h1>
              </div>
              <nav className="flex items-center gap-3 sm:gap-4">
                <a 
                  href="https://github.com/kirabian/quicksync-ai" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="hidden sm:inline">Star on </span>GitHub
                </a>
                <ThemeToggle />
              </nav>
            </header>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" richColors />
          <OfflineIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
