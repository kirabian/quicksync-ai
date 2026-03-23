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
    return NextResponse.json(
      { error: "Failed to fetch YouTube transcript", details: error.message },
      { status: 500 }
    );
  }
}
