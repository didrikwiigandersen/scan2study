"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function StudyPage() {
  const router = useRouter()
  const [parsedText, setParsedText] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get data from localStorage
    const text = localStorage.getItem("scan2study:parsedText")
    const name = localStorage.getItem("scan2study:fileName")

    setParsedText(text)
    setFileName(name)
    setIsLoaded(true)
  }, [])

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isSending])

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

  const handleSend = async () => {
    // Prevent sending if input is empty or already sending
    if (chatInput.trim().length === 0 || isSending) {
      return
    }

    if (!parsedText || typeof parsedText !== "string" || parsedText.trim().length === 0) {
      setChatError("No text available. Please upload a PDF first.")
      return
    }

    // Clear error
    setChatError(null)

    // Save the user question
    const userQuestion = chatInput.trim()

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userQuestion,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsSending(true)

    try {
      const response = await fetch("/api/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: parsedText, question: userQuestion }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || "Failed to get answer"
        setChatError(errorMessage)
        setIsSending(false)
        return
      }

      const data = await response.json()
      const { answer } = data

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      }

      setChatMessages((prev) => [...prev, assistantMessage])
      setIsSending(false)
    } catch (err) {
      console.error("Error sending message:", err)
      setChatError("An unexpected error occurred. Please try again.")
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Main Content */}
      <main className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-16">
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

            {/* Ask questions panel */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Ask questions about this reading</h2>
              
              {/* Chat messages area */}
              <div className="h-80 overflow-y-auto flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                {chatMessages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Ask a question about the reading to get started.
                  </p>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-sky-600 text-white"
                            : "bg-slate-800 text-slate-50"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-50 rounded-lg px-4 py-2">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat error */}
              {chatError && (
                <div className="text-sm text-destructive text-center">
                  {chatError}
                </div>
              )}

              {/* Chat input and send button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about the reading..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  disabled={isSending || chatInput.trim().length === 0}
                  size="lg"
                >
                  {isSending ? "Thinking…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

