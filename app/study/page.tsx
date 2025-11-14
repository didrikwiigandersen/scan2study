"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { BookOpen, GraduationCap, Book } from "lucide-react"

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [hasGeneratedSummary, setHasGeneratedSummary] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get data from localStorage
    const text = localStorage.getItem("scan2study:parsedText")
    const name = localStorage.getItem("scan2study:fileName")

    setParsedText(text)
    setFileName(name)
    setIsLoaded(true)
  }, [])

  // Auto-generate summary on load
  useEffect(() => {
    if (!parsedText || hasGeneratedSummary || chatMessages.length > 0) {
      return
    }

    const generateSummary = async () => {
      // Add loading message
      const loadingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Generating summary...",
      }
      setChatMessages([loadingMessage])
      setHasGeneratedSummary(true)

      try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: parsedText }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || "Failed to generate summary"
          setChatMessages([
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `Sorry, I couldn't generate a summary: ${errorMessage}`,
            },
          ])
          return
        }

        const data = await response.json()
        const { summary } = data

        // Replace loading message with actual summary
        setChatMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: summary,
          },
        ])
      } catch (err) {
        console.error("Error generating summary:", err)
        setChatMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, an error occurred while generating the summary. Please try asking a question instead.",
          },
        ])
      }
    }

    generateSummary()
  }, [parsedText, hasGeneratedSummary, chatMessages.length])

  // Auto-scroll chat to bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isSending])

  const handleDownloadTxt = () => {
    if (!parsedText || typeof parsedText !== "string" || parsedText.trim().length === 0) {
      setChatError("No text available to download. Please upload a PDF first.")
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
      setChatError("Failed to download file. Please try again.")
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
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="font-sans text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Scan2Study
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/about"
              className="font-sans text-base sm:text-sm lg:text-md font-normal text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              About
            </Link>
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

      {!isLoaded ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : !parsedText ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-6 shadow-sm animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-900">No document loaded</p>
              <p className="text-sm text-gray-500">Please go back and upload a PDF to get started.</p>
            </div>
            <Button onClick={() => router.push("/")} className="w-full" size="lg">
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-4xl mx-auto w-full relative">
          {/* Subtle floating icons */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-32 right-[10%] rotate-12 animate-float opacity-30" style={{ animationDelay: "0s", animationDuration: "8s" }}>
              <BookOpen className="w-6 h-6 text-gray-300" />
            </div>
            <div className="absolute bottom-40 left-[8%] -rotate-6 animate-float opacity-30" style={{ animationDelay: "2s", animationDuration: "10s" }}>
              <GraduationCap className="w-8 h-8 text-gray-300" />
            </div>
            <div className="absolute top-1/2 right-[15%] rotate-20 animate-float opacity-30" style={{ animationDelay: "4s", animationDuration: "9s" }}>
              <Book className="w-7 h-7 text-gray-300" />
            </div>
          </div>

          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#fafafa]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {fileName}
              </h1>
            </div>
            <button
              onClick={handleDownloadTxt}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 shrink-0"
              aria-label="Download .txt"
              title="Download .txt"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </header>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto bg-[#fafafa] px-4 sm:px-6 py-8 relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[60vh] animate-fade-in">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Where should we begin?
                      </p>
                      <p className="text-sm text-gray-500">
                        Ask anything about this reading, e.g. "What is the author's main argument?"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      } animate-fade-in`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm transition-all ${
                          message.role === "user"
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="text-[15px] leading-relaxed [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:italic [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_li]:my-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:my-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:my-2 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-2">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-[15px] whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input bar */}
          <div className="sticky bottom-0 bg-[#fafafa] px-4 sm:px-6 py-5 z-20">
            <div className="max-w-3xl mx-auto">
              {chatError && (
                <div className="text-sm text-red-600 mb-3 text-center px-4 py-2 bg-red-50 rounded-xl border border-red-100 animate-fade-in">
                  {chatError}
                </div>
              )}
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask anything about ${fileName}`}
                  className="flex-1 px-5 py-3.5 bg-[#fafafa] border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-[15px] placeholder:text-gray-400 disabled:opacity-50"
                  disabled={isSending}
                />
                <Button
                  onClick={handleSend}
                  disabled={isSending || chatInput.trim().length === 0}
                  size="lg"
                  className="px-6 h-[50px] rounded-2xl bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Thinking</span>
                    </div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

