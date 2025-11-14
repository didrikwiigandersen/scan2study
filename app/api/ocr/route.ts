import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Check if file is missing
    if (!file) {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    // Check if file is a PDF - check both type and file extension
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    
    if (!isPDF) {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 }
      );
    }

    // Get the file name
    const fileName = file.name;

    // Return placeholder OCR text
    return NextResponse.json({
      text: "This is placeholder OCR text for now.",
      fileName,
    });
  } catch (error) {
    console.error("Error processing OCR request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

