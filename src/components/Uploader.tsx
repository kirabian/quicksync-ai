"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import pdfToText from "react-pdftotext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Type, Loader2, UserCircle, Link as LinkIcon, Youtube, Globe } from "lucide-react";
import { toast } from "sonner";

export default function Uploader({ onProcessText }: { onProcessText: (text: string, role: string) => Promise<void> }) {
  const [activeTab, setActiveTab] = useState<"file" | "text" | "url">("file");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [role, setRole] = useState("General");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 95) return p;
          return p + 2.5; 
        });
      }, 500);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      setIsProcessing(true);
      const extractedText = await pdfToText(file);
      await onProcessText(extractedText, role);
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsProcessing(false);
    }
  }, [onProcessText, role]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }
    
    try {
      setIsProcessing(true);
      await onProcessText(textInput, role);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim() || !urlInput.startsWith("http")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      setIsProcessing(true);
      const isYoutube = urlInput.includes("youtube.com") || urlInput.includes("youtu.be");
      const endpoint = isYoutube ? "/api/youtube" : "/api/scrape";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || "Failed to fetch content from URL");
      }

      const data = await res.json();
      if (!data.text || data.text.trim() === "") {
        throw new Error("No readable text found on this page.");
      }

      await onProcessText(data.text, role);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to process URL");
    } finally {
      setIsProcessing(false);
    }
  };

  const roles = ["General", "Student", "Programmer", "Business", "Lawyer"];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-900/50 border-white/20 overflow-hidden relative">
      {isProcessing && (
        <div className="absolute top-0 left-0 h-1 bg-zinc-200 dark:bg-zinc-800 w-full z-10">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-col sm:flex-row flex-1 gap-2 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-lg text-sm">
            <div className="flex flex-1 gap-1">
              <Button 
                variant={activeTab === "file" ? "default" : "ghost"} 
                className="flex-1 transition-all px-2 whitespace-nowrap h-9 sm:h-10"
                onClick={() => setActiveTab("file")}
                disabled={isProcessing}
              >
                <FileUp className="w-4 h-4 mr-2" />
                <span>PDF</span>
              </Button>
              <Button 
                variant={activeTab === "text" ? "default" : "ghost"} 
                className="flex-1 transition-all px-2 whitespace-nowrap h-9 sm:h-10"
                onClick={() => setActiveTab("text")}
                disabled={isProcessing}
              >
                <Type className="w-4 h-4 mr-2" />
                <span>Text</span>
              </Button>
              <Button 
                variant={activeTab === "url" ? "default" : "ghost"} 
                className="flex-1 transition-all px-2 whitespace-nowrap h-9 sm:h-10"
                onClick={() => setActiveTab("url")}
                disabled={isProcessing}
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                <span>Link / YT</span>
              </Button>
            </div>
          </div>
          
          <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-1 px-3">
            <UserCircle className="w-4 h-4 text-muted-foreground mr-2" />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              disabled={isProcessing}
              className="bg-transparent text-sm font-medium focus:outline-none appearance-none cursor-pointer text-foreground pr-4"
            >
              {roles.map(r => (
                <option key={r} value={r} className="bg-white dark:bg-zinc-900 text-foreground">{r}</option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "file" && (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50"} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                <div className="text-sm font-medium text-primary fade-in animate-in">
                  Memproses {role}... estimated {Math.max(1, Math.floor((100 - progress) / 5))}s
                </div>
              </div>
            ) : (
              <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            )}
            {!isProcessing && (
              <>
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  or click to browse from your computer
                </p>
              </>
            )}
          </div>
        )}

        {activeTab === "text" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Textarea
              placeholder="Paste your document text here..."
              className="min-h-[200px] resize-y transition-all focus:ring-2"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isProcessing}
            />
            <Button 
              className="w-full transition-all" 
              onClick={handleTextSubmit}
              disabled={isProcessing || !textInput.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses {role} ({Math.floor(progress)}%)...
                </>
              ) : "Process Text"}
            </Button>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                {urlInput.includes("youtu") ? (
                  <Youtube className="w-5 h-5 text-red-500" />
                ) : (
                  <Globe className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <input
                type="url"
                placeholder="https://youtube.com/... or https://kompas.com/..."
                className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-muted-foreground px-1">
              Paste a URL to an article, blog post, or YouTube video to render a summary directly.
            </p>
            <Button 
              className="w-full transition-all" 
              onClick={handleUrlSubmit}
              disabled={isProcessing || !urlInput.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengunduh konten & Memproses ({Math.floor(progress)}%)...
                </>
              ) : "Process URL"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
