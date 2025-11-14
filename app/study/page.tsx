"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function StudyPage() {
  const router = useRouter()
  const [parsedText, setParsedText] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get data from localStorage
    const text = localStorage.getItem("scan2study:parsedText")
    const name = localStorage.getItem("scan2study:fileName")

    setParsedText(text)
    setFileName(name)
    setIsLoaded(true)
  }, [])

  const handleDownloadTxt = () => {
    if (!parsedText || typeof parsedText !== "string" || parsedText.trim().length === 0) {
      setError("No text available to download. Please upload a PDF first.")
      return
    }

    try {
      // Create Blob with text/plain type
      const blob = new Blob([parsedText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // Get filename without extension
      const fileNameWithoutExtension = fileName
        ? fileName.replace(/\.[^/.]+$/, "")
        : "reading"

      // Create temporary anchor element
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileNameWithoutExtension}.txt`

      // Append, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Revoke object URL
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading file:", err)
      setError("Failed to download file. Please try again.")
    }
  }

  const handleGenerateSummary = async () => {
    if (!parsedText || typeof parsedText !== "string" || parsedText.trim().length === 0) {
      setError("No text available to summarize. Please upload a PDF first.")
      return
    }

    setIsSummarizing(true)
    setError(null)

    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: parsedText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || "Failed to generate summary"
        setError(errorMessage)
        setIsSummarizing(false)
        return
      }

      const data = await response.json()
      setSummary(data.summary)
      setIsSummarizing(false)
    } catch (err) {
      console.error("Error generating summary:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSummarizing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Left */}
          <div className="font-sans text-xl sm:text-xl lg:text-2xl font-bold text-gray-900">
            Scan2Study
          </div>
          
          {/* About and GitHub - Right */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="font-sans text-base sm:text-md lg:text-lg font-normal text-gray-700 hover:text-gray-900 transition-colors cursor-pointer">
              About
            </div>
            <a
              href="https://github.com/didrikwiigandersen/scan2study"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="GitHub repository"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] w-full max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-16">
        {!isLoaded ? (
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : !parsedText ? (
          <div className="w-full max-w-2xl bg-white rounded-lg border p-8 text-center space-y-4">
            <p className="text-gray-700">No document loaded. Please go back and upload a PDF.</p>
            <Button onClick={() => router.push("/")} className="w-full" size="lg">
              Go Back
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {/* File name as heading with download button */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1">
                {fileName}
              </h1>
              <Button
                onClick={handleDownloadTxt}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                Download .txt
              </Button>
            </div>

            {/* Generate summary button */}
            <Button
              onClick={handleGenerateSummary}
              className="w-full"
              size="lg"
              disabled={isSummarizing}
            >
              {isSummarizing ? "Generating summary…" : "Generate summary"}
            </Button>

            {/* Error message */}
            {error && (
              <div className="text-sm text-destructive text-center">
                {error}
              </div>
            )}

            {/* Summary display */}
            {summary && (
              <div className="bg-white rounded-lg border p-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                <div className="prose max-w-none">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {summary.split('\n').map((line, index) => {
                      // Check if line looks like a bullet point
                      if (line.trim().match(/^[•\-\*]\s/) || line.trim().match(/^\d+\.\s/)) {
                        return (
                          <div key={index} className="mb-2 pl-4">
                            {line.trim()}
                          </div>
                        )
                      }
                      return (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

