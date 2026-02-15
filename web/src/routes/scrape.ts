import SnippetRepository from "@/services/SnippetRepository";
import { Snippet } from "@/types/Snippet";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Snippets = z.array(Snippet);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = Snippets.safeParse(body.tweets);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload, expected array of Snippet objects under 'tweets'" },
        { status: 400 }
      );
    }

    const createdSnippets = [];
    for (const snippet of parseResult.data) {
      try {
        const created = await SnippetRepository.createSnippet(snippet);
        createdSnippets.push(created);
      } catch (err) {
        console.error("Failed to create snippet:", snippet.summary, err);
      }
    }

    return NextResponse.json({
      status: 200,
      created: createdSnippets.length,
    });
  } catch (err) {
    console.error("Error in POST /api/scrape:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const geohash = url.searchParams.get("geohash") ?? undefined;
    const startTime = url.searchParams.get("startTime") ?? undefined;
    const endTime = url.searchParams.get("endTime") ?? undefined;

    const snippets = await SnippetRepository.getSnippets(geohash, startTime, endTime);

    return NextResponse.json({ snippets });
  } catch (err) {
    console.error("Error in GET /api/scrape:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}