import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini-2024-07-18"),
    messages,
  });

  return result.toDataStreamResponse({
    headers: { "Content-Type": "application/octet-stream" },
  });
}
