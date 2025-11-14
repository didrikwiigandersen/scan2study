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
    const { text } = await req.json();

    // Validate text
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Call Anthropic Messages API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `
You are a study assistant for university students. 
When given a course reading, you create a concise, focused summary.

Your goals:
- Help the student quickly grasp the main ideas, arguments, and structure of the text.
- Use clear, simple language suitable for an undergraduate with no prior background.
- Briefly explain any important terms or concepts the student might not know.

Format your response as 4–6 bullet points.
Each bullet should be 1–3 sentences long.
`.trim(),
      messages: [
        {
          role: "user",
          content: `
Summarize the following course reading for a student who needs to understand it for class, homework, and exams.

Focus on:
- The author's main thesis or central question.
- 2–4 key arguments or ideas.
- Any important concepts, terms, or definitions (briefly explain them in simple language).
- Any major conclusions or implications.

Keep the summary short but rich in information, and avoid copying long sentences verbatim.

Reading:

${text}
    `.trim(),
        },
      ],
    });

    // Extract the response text
    const summary = message.content[0].type === "text" 
      ? message.content[0].text 
      : "Failed to extract summary.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}

