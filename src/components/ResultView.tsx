"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResultView({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  // Parse language tag
  let displayMarkdown = markdown;
  let detectedLang = "";

  const langMatch = markdown.match(/^\[LANG:([A-Za-z]+)\]\s*/);
  if (langMatch) {
    detectedLang = langMatch[1].toUpperCase();
    displayMarkdown = markdown.replace(/^\[LANG:[A-Za-z]+\]\s*/, "");
  }

  const getLangBadge = (code: string) => {
    switch (code) {
      case "ID": return "🇮🇩 ID-ID";
      case "JA": return "🇯🇵 JA-JP";
      case "EN": return "🇬🇧 EN-US";
      case "ES": return "🇪🇸 ES";
      case "FR": return "🇫🇷 FR";
      case "KR": return "🇰🇷 KR";
      case "CN": return "🇨🇳 CN-ZH";
      default: return `🌐 ${code}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayMarkdown);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([displayMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quicksync-notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully!");
  };

  if (!markdown) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 shadow-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-zinc-200 dark:border-zinc-800 transition-all overflow-hidden relative">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b space-y-0">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Your Processed Notes
          </CardTitle>
          {detectedLang && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-primary/10 text-primary border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-300">
              {getLangBadge(detectedLang)}
            </span>
          )}
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 sm:flex-none gap-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload} className="flex-1 sm:flex-none gap-2 transition-all hover:scale-[1.02] shadow-md">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download .md</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 text-left prose prose-zinc dark:prose-invert max-w-none prose-sm sm:prose-base prose-headings:font-bold prose-h2:text-primary prose-a:text-primary hover:prose-a:text-primary/80 overflow-x-auto w-full">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {displayMarkdown}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
