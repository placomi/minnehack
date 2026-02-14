import { Snippet, SnippetT } from "@/src/types/Snippet";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Snippets = z.array(Snippet);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = Snippets.safeParse(body.tweets);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload, expected array of Snippet objects" },
        { status: 400 }
      );
    }

    const snippets = parseResult.data;

    // TODO: insert snippets into dynamodb local db thing
    console.log("Received snippets:", snippets.length);

    return NextResponse.json({
      status: 200,
      received: snippets.length,
    });
  } catch (err) {
    console.error("Error in /api/scrape:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}