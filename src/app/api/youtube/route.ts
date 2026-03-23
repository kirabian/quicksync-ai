import { NextResponse } from "next/server";

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

    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!pageRes.ok) throw new Error("Could not fetch YouTube page");
    const html = await pageRes.text();

    const playerResponseMatch = html.match(/var ytInitialPlayerResponse = ({.+?});/);
    if (!playerResponseMatch) throw new Error("Could not find transcript data in page");

    const playerResponse = JSON.parse(playerResponseMatch[1]);
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || !Array.isArray(captionTracks) || captionTracks.length === 0) {
      throw new Error("Transcript is disabled on this video");
    }

    let selectedTrack = captionTracks.find((t: any) => t.languageCode === 'id' && t.kind !== 'asr') ||
                        captionTracks.find((t: any) => t.languageCode === 'id') ||
                        captionTracks.find((t: any) => t.languageCode === 'en') ||
                        captionTracks[0];

    const transcriptRes = await fetch(selectedTrack.baseUrl);
    if (!transcriptRes.ok) throw new Error("Could not fetch transcript text");
    const xml = await transcriptRes.text();

    const textMatches = xml.matchAll(/<text start=".*?" dur=".*?">([\s\S]*?)<\/text>/g);
    let fullText = Array.from(textMatches)
      .map(match => match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/<[^>]+>/g, '')
      )
      .join(" ");

    if (!fullText.trim()) throw new Error("Transcript exists but contains no text");

    return NextResponse.json({ text: fullText });
  } catch (error: any) {
    console.error("YouTube Transcript Error:", error);
    
    let errorMessage = "Gagal mengambil teks dari video YouTube.";
    if (error.message?.includes("Transcript is disabled") || error.message?.includes("forbidden")) {
      errorMessage = "Video ini tidak memiliki subtitle/CC aktif yang dapat terbaca secara otomatis.";
    } else if (error.message?.includes("Invalid YouTube URL")) {
      errorMessage = "URL video YouTube tidak valid.";
    }

    return NextResponse.json(
      { error: "Failed to fetch YouTube transcript", details: errorMessage },
      { status: 400 }
    );
  }
}
