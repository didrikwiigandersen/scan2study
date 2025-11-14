import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Check for API key
    const apiKey = process.env.OCR_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OCR_API_KEY is not configured." },
        { status: 500 }
      );
    }

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

    // Check file size (1MB limit for free tier)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 1) {
      return NextResponse.json(
        { error: "File size exceeds 1MB limit. Please upload a smaller file." },
        { status: 400 }
      );
    }

    // Get the file name
    const fileName = file.name;

    // Convert file to buffer, then to File for FormData
    const arrayBuffer = await file.arrayBuffer();
    const fileForUpload = new File([arrayBuffer], fileName, { type: "application/pdf" });

    // Create form data for OCR.space API
    // Using native FormData (available in Node.js 18+)
    const ocrFormData = new FormData();
    // Append the file
    ocrFormData.append("file", fileForUpload);
    ocrFormData.append("language", "eng");
    ocrFormData.append("isOverlayRequired", "false");

    // Call OCR.space API
    const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: apiKey,
      },
      body: ocrFormData,
    });

    if (!ocrResponse.ok) {
      console.error("OCR.space API error:", ocrResponse.status, ocrResponse.statusText);
      return NextResponse.json(
        { error: "Failed to process PDF. Please try again." },
        { status: 500 }
      );
    }

    const ocrData = await ocrResponse.json();

    // Check for errors in OCR response
    if (ocrData.IsErroredOnProcessing) {
      console.error("OCR processing error:", ocrData.ErrorMessage);
      return NextResponse.json(
        { error: ocrData.ErrorMessage || "Failed to extract text from PDF." },
        { status: 500 }
      );
    }

    // Extract parsed text from all pages
    let extractedText = "";
    if (ocrData.ParsedResults && ocrData.ParsedResults.length > 0) {
      extractedText = ocrData.ParsedResults
        .map((result: any) => {
          if (result.FileParseExitCode === 1 && result.ParsedText) {
            return result.ParsedText.trim();
          }
          return "";
        })
        .filter((text: string) => text.length > 0)
        .join("\n\n");
    }

    if (!extractedText) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: extractedText,
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

