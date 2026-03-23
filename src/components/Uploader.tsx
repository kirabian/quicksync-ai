"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import pdfToText from "react-pdftotext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Type, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Uploader({ onProcessText }: { onProcessText: (text: string) => Promise<void> }) {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
      await onProcessText(extractedText);
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsProcessing(false);
    }
  }, [onProcessText]);

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
      await onProcessText(textInput);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg backdrop-blur-sm bg-white/50 dark:bg-zinc-900/50 border-white/20">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === "file" ? "default" : "outline"} 
            className="flex-1 transition-all"
            onClick={() => setActiveTab("file")}
          >
            <FileUp className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
          <Button 
            variant={activeTab === "text" ? "default" : "outline"} 
            className="flex-1 transition-all"
            onClick={() => setActiveTab("text")}
          >
            <Type className="w-4 h-4 mr-2" />
            Paste Text
          </Button>
        </div>

        {activeTab === "file" ? (
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
              ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50"}
              ${isProcessing ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary mb-4" />
            ) : (
              <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            )}
            <p className="text-lg font-medium">
              {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              or click to browse from your computer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  Processing...
                </>
              ) : "Process Text"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
