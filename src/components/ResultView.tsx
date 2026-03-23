"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Globe, Send, Loader2, X, Settings, Volume2, VolumeX, History, Calendar, Link as LinkIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import LZString from "lz-string";

export default function ResultView({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);
  
  // Storage for Version translation history
  const [originalMarkdown, setOriginalMarkdown] = useState(markdown);
  const [currentMarkdown, setCurrentMarkdown] = useState(markdown);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Typewriter states
  const [renderText, setRenderText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // TTS states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Notion state
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [notionToken, setNotionToken] = useState("");
  const [notionPageId, setNotionPageId] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showTranslationMenu, setShowTranslationMenu] = useState(false);

  useEffect(() => {
    setOriginalMarkdown(markdown);
    setCurrentMarkdown(markdown);
    setIsTranslated(false);
  }, [markdown]);

  useEffect(() => {
    setNotionToken(localStorage.getItem("notionToken") || "");
    setNotionPageId(localStorage.getItem("notionPageId") || "");
    
    // Cleanup TTS on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Parse language tag
  let displayMarkdown = currentMarkdown;
  let detectedLang = "";

  const langMatch = currentMarkdown.match(/^\[LANG:([A-Za-z]+)\]\s*/);
  if (langMatch) {
    detectedLang = langMatch[1].toUpperCase();
    displayMarkdown = currentMarkdown.replace(/^\[LANG:[A-Za-z]+\]\s*/, "");
  }

  // Typewriter Effect Logic
  useEffect(() => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    setRenderText("");
    setIsTyping(true);
    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      setRenderText(displayMarkdown.substring(0, i));
      i += 3; // speed multiplier
      if (i > displayMarkdown.length) {
        setRenderText(displayMarkdown);
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 10);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [displayMarkdown]);

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!window.speechSynthesis) {
      toast.error("Text-to-speech not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const textToRead = displayMarkdown.replace(/#/g, "").replace(/\*/g, "").replace(/\[|\]/g, "");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance; // Store to prevent GC
    
    // Auto-detect voice based on language
    const voices = window.speechSynthesis.getVoices();
    if (detectedLang === "ID") utterance.lang = "id-ID";
    else if (detectedLang === "JA") utterance.lang = "ja-JP";
    else if (detectedLang === "ES") utterance.lang = "es-ES";
    else utterance.lang = "en-US";

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => {
      setIsPlayingAudio(false);
      utteranceRef.current = null;
    };
    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsPlayingAudio(false);
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

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

  const handleShareLink = () => {
    const contentToEncode = detectedLang ? `[LANG:${detectedLang}] ${displayMarkdown}` : displayMarkdown;
    const encoded = LZString.compressToEncodedURIComponent(contentToEncode);
    const shareUrl = `${window.location.origin}/?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Collaboration link copied!");
  };

  const handleGoogleCalendar = () => {
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', 'Meeting from QuickSync AI');
    url.searchParams.append('details', displayMarkdown.substring(0, 500));
    window.open(url.toString(), '_blank');
  };

  const handleTranslate = async (langName: string) => {
    setShowTranslationMenu(false);
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentMarkdown, targetLanguage: langName })
      });
      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      setCurrentMarkdown(data.result);
      setIsTranslated(true);
      toast.success(`Translated to ${langName}`);
    } catch (err: any) {
      toast.error(err.message || "Translation error");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRevertLanguage = () => {
    setCurrentMarkdown(originalMarkdown);
    setIsTranslated(false);
  };

  const saveNotionSettings = () => {
    localStorage.setItem("notionToken", notionToken);
    localStorage.setItem("notionPageId", notionPageId);
    toast.success("Notion settings saved!");
    if (notionToken && notionPageId) {
      handleExportNotion();
    }
  };

  const handleExportNotion = async () => {
    if (!notionToken || !notionPageId) {
      setShowNotionModal(true);
      return;
    }
    setIsExporting(true);
    try {
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: displayMarkdown, token: notionToken, pageId: notionPageId })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || err.error || "Failed to export to Notion");
      }
      toast.success("Successfully sent to Notion!");
      setShowNotionModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (!markdown) return null;

  const translationOptions = ["English", "Indonesian", "Japanese", "Spanish", "French", "Korean", "Chinese"];

  return (
    <>
      <div className="w-full flex justify-center gap-2 mb-4 print:hidden px-4 max-w-4xl mx-auto flex-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
        <Button variant="outline" size="sm" onClick={handleShareLink} className="gap-2 text-indigo-600 hover:text-indigo-600 hover:bg-indigo-600/10 transition-colors border-indigo-600/20 shadow-sm font-semibold">
          <LinkIcon className="w-4 h-4" /> Share Link
        </Button>
        <Button variant="outline" size="sm" onClick={handleGoogleCalendar} className="gap-2 text-primary hover:text-primary hover:bg-primary/10 transition-colors border-primary/20">
          <Calendar className="w-4 h-4" /> Google Calendar
        </Button>
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur border-zinc-200 dark:border-zinc-800 transition-all overflow-hidden relative print:shadow-none print:border-none print:bg-white">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b print:border-b-2 print:border-black space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 print:text-black flex items-center gap-2">
              <span className="print:hidden">Your Processed Notes</span>
              <span className="hidden print:inline font-bold text-2xl">QuickSync AI Report</span>
              
              {isPlayingAudio ? (
                <button onClick={handlePlayAudio} className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors print:hidden" title="Stop Audio">
                  <VolumeX className="w-4 h-4 animate-pulse" />
                </button>
              ) : (
                <button onClick={handlePlayAudio} className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors print:hidden" title="Read Aloud">
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 print:hidden">
              {detectedLang && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-primary/10 text-primary border border-primary/20 shadow-sm animate-in fade-in zoom-in duration-300">
                  {getLangBadge(detectedLang)}
                </span>
              )}
              {isTranslating && (
                <span className="flex items-center text-xs text-muted-foreground animate-pulse">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Translating...
                </span>
              )}
              {isTranslated && !isTranslating && (
                <button onClick={handleRevertLanguage} className="flex items-center text-xs text-zinc-500 hover:text-primary transition-colors hover:underline">
                  <History className="w-3 h-3 mr-1" /> Original
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap w-full md:w-auto gap-2 print:hidden">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTranslationMenu(!showTranslationMenu)}
                className="gap-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 w-full sm:w-auto"
                disabled={isTranslating}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Translate</span>
              </Button>
              {showTranslationMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                  {translationOptions.map((lang) => (
                    <button
                      key={lang}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      onClick={() => handleTranslate(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-1 sm:flex-none">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-1 sm:flex-none" title="Download Markdown">
              <Download className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleExportNotion} 
              className="gap-2 transition-all hover:scale-[1.02] shadow-md flex-1 sm:flex-none bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Notion</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 text-left prose prose-zinc dark:prose-invert max-w-none prose-sm sm:prose-base prose-headings:font-bold prose-h2:text-primary prose-a:text-primary hover:prose-a:text-primary/80 overflow-x-auto w-full print:text-black print:prose-headings:text-black">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {renderText}
          </ReactMarkdown>
          {isTyping && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle rounded-sm print:hidden"></span>
          )}
        </CardContent>
      </Card>

      {/* Notion Settings Modal */}
      {showNotionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 print:hidden">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-zinc-500" />
                Notion Integration
              </h3>
              <button 
                onClick={() => setShowNotionModal(false)}
                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Internal Integration Token</label>
                <p className="text-xs text-zinc-500 mb-2">Create an integration at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="text-primary hover:underline">my-integrations</a>, copy the secret token, and share your target page with this integration.</p>
                <input 
                  type="password"
                  value={notionToken}
                  onChange={(e) => setNotionToken(e.target.value)}
                  placeholder="secret_..."
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notion Page ID or URL</label>
                <p className="text-xs text-zinc-500 mb-2">The ID or full link of the page where the notes should be sent.</p>
                <input 
                  type="text"
                  value={notionPageId}
                  onChange={(e) => setNotionPageId(e.target.value)}
                  placeholder="e.g. 1a2b3c4d5e6f4789b9c0d... or full URL"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-end items-center">
              <Button variant="ghost" onClick={() => setShowNotionModal(false)}>Cancel</Button>
              <Button onClick={saveNotionSettings} disabled={isExporting}>
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save & Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
