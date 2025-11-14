import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  try {
    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Parse request body
    const { text, question } = await req.json();

    // Validate text and question
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Call Anthropic Messages API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: `You are a helpful study assistant for university students.
The user will give you a course reading and a question about it.
Answer only based on the reading.
If the answer is not clearly supported by the text, say:
"I'm not sure based on this reading alone."
Keep answers short and clear (3–6 sentences max).`.trim(),
      messages: [
        {
          role: "user",
          content: `Here is the course reading:\n\n${text}\n\nThe student asks:\n\n${question}\n\nAnswer based only on the reading.`,
        },
      ],
    });

    // Extract the response text
    const answer = message.content[0].type === "text" 
      ? message.content[0].text 
      : "Failed to extract answer.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error answering question:", error);
    return NextResponse.json(
      { error: "Failed to answer question." },
      { status: 500 }
    );
  }
}

