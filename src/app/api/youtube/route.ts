import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json(
    { 
      error: "YouTube links are not supported", 
      details: "YouTube transcription has been disabled. Please use article or news links." 
    },
    { status: 400 }
  );
}
