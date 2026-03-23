import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";

export async function POST(req: Request) {
  try {
    const { markdown, token, pageId } = await req.json();

    if (!markdown || !token || !pageId) {
      return NextResponse.json(
        { error: "Markdown content, Notion Token, and Page ID are required." },
        { status: 400 }
      );
    }

    // Clean up pageId if user pastes a full URL
    // e.g. https://www.notion.so/My-Page-Title-a1b2c3d4e5f64789b9c0d1e2f3a4b5c6
    let parsedPageId = pageId;
    if (pageId.includes("-")) {
      const parts = pageId.split("-");
      parsedPageId = parts[parts.length - 1];
    } else if (pageId.includes("/")) {
      const parts = pageId.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes("-")) {
        const subParts = lastPart.split("-");
        parsedPageId = subParts[subParts.length - 1];
      } else {
        parsedPageId = lastPart;
      }
    }
    // Remove formatting like ?v=...
    parsedPageId = parsedPageId.split("?")[0];

    const notion = new Client({ auth: token });
    const blocks = markdownToBlocks(markdown);

    // Append blocks to the specified page
    await notion.blocks.children.append({
      block_id: parsedPageId,
      children: blocks as any, // Typecast since martian types might slightly differ from official notion types sometimes
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion Export Error:", error);
    return NextResponse.json(
      { error: "Failed to export to Notion", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
