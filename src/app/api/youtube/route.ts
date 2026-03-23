import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(url);
    
    // Combine text from transcript array
    const fullText = transcript.map(t => t.text).join(" ");

    return NextResponse.json({ text: fullText });
  } catch (error: any) {
    console.error("YouTube Transcript Error:", error);
    
    let errorMessage = "Gagal mengambil teks dari video YouTube.";
    if (error.message?.includes("Transcript is disabled")) {
      errorMessage = "Video ini tidak memiliki subtitle/CC aktif. Silakan cari video lain yang memiliki subtitle.";
    } else if (error.message?.includes("No video id found")) {
      errorMessage = "URL video YouTube tidak valid.";
    }

    return NextResponse.json(
      { error: "Failed to fetch YouTube transcript", details: errorMessage },
      { status: 400 }
    );
  }
}
