"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/utils/file-upload"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function UploadPanel() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isParsing, setIsParsing] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleParse = async (file: File) => {
    setIsParsing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || "Failed to parse PDF"
        setError(errorMessage)
        setIsParsing(false)
        return
      }

      const data = await response.json()
      const { text, fileName } = data

      // Validate that we received text
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        setError("No text could be extracted from the PDF. Please try a different file.")
        setIsParsing(false)
        return
      }

      // Store in localStorage
      localStorage.setItem("scan2study:parsedText", text)
      localStorage.setItem("scan2study:fileName", fileName || "document.pdf")

      // Navigate to study page
      router.push("/study")
    } catch (err) {
      console.error("Error parsing PDF:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsParsing(false)
    }
  }

  const handleFileSelect = (file: File | null) => {
    if (file) {
      // Validate PDF - check both type and file extension
      const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
      
      if (isPDF) {
        setSelectedFile(file)
        setError(null)
        // Immediately call handleParse when a valid PDF is selected
        handleParse(file)
      } else {
        setError("Please upload a PDF file.")
        setSelectedFile(null)
      }
    } else {
      setSelectedFile(null)
      setError(null)
    }
  }

  return (
    <div className="w-full space-y-4">
      <FileUpload
        onFileSelect={handleFileSelect}
        accept="application/pdf"
        className={cn(isParsing && "pointer-events-none opacity-50")}
      />
      
      {/* Status line */}
      <div className="text-center">
        {isParsing ? (
          <p className="text-sm text-muted-foreground">Parsing PDF…</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Ready to parse</p>
        )}
      </div>

      {/* Continue button (hidden/disabled during parsing) */}
      {selectedFile && (
        <Button
          onClick={() => selectedFile && handleParse(selectedFile)}
          className="w-full"
          size="lg"
          disabled={isParsing}
        >
          {isParsing ? "Parsing your PDF…" : error ? "Retry" : "Continue"}
        </Button>
      )}
    </div>
  )
}

