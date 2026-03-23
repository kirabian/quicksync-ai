import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
    }

    const videoId = url.includes("youtu.be/") 
      ? url.split("youtu.be/")[1]?.split("?")[0] 
      : url.match(/[?&]v=([^&]+)/)?.[1];

    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    let transcript;
    try {
      // Try standard fetch first with ID
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (e) {
      console.warn("Standard YT fetch failed, trying 'id'...", e);
      try {
        // Fallback to Indonesian for local videos
        transcript = await YoutubeTranscript.fetchTranscript(url, { lang: 'id' });
      } catch (e2) {
        console.warn("YT fetch 'id' failed, trying 'en'...", e2);
        // Final fallback to English
        transcript = await YoutubeTranscript.fetchTranscript(url, { lang: 'en' });
      }
    }
    
    // Combine text from transcript array
    const fullText = transcript.map((t: any) => t.text).join(" ");

    return NextResponse.json({ text: fullText });
  } catch (error: any) {
    console.error("YouTube Transcript Error:", error);
    
    let errorMessage = "Gagal mengambil teks dari video YouTube.";
    if (error.message?.includes("Transcript is disabled") || error.message?.includes("could not find")) {
      errorMessage = "Video ini tidak memiliki subtitle/CC aktif yang dapat terbaca. Silakan cari video lain.";
    } else if (error.message?.includes("No video id found")) {
      errorMessage = "URL video YouTube tidak valid.";
    }

    return NextResponse.json(
      { error: "Failed to fetch YouTube transcript", details: errorMessage },
      { status: 400 }
    );
  }
}
