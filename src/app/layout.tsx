import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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
            <header className="py-4 px-6 md:px-12 flex items-center justify-between border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
              <h1 className="text-xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">QuickSync AI</h1>
              <nav className="flex items-center gap-4">
                <a href="https://github.com/kirabian/quicksync-ai" target="_blank" rel="noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Star on GitHub</a>
                <ThemeToggle />
              </nav>
            </header>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
