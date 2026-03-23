import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and empty elements
    $("script, style, nav, footer, iframe, noscript").remove();

    // Try to focus on article content
    let coreText = $("article").text();
    if (!coreText.trim()) {
      coreText = $("main").text();
    }
    if (!coreText.trim()) {
      coreText = $("body").text();
    }

    // Clean up excessive whitespace
    const cleanText = coreText.replace(/\s+/g, " ").trim();

    return NextResponse.json({ text: cleanText });
  } catch (error: any) {
    console.error("Scraping Error:", error);
    return NextResponse.json(
      { error: "Failed to scrape URL", details: error.message },
      { status: 500 }
    );
  }
}
