"use client"

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Navigation Bar */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Left */}
          <Link 
            href="/"
            className="font-sans text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Scan2Study
          </Link>
          
          {/* About and GitHub - Right */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="font-sans text-base sm:text-sm lg:text-md font-normal text-gray-700">
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

      {/* Main Content - Centered */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl w-full">
          <p className="text-base sm:text-md text-gray-700 leading-relaxed">
            I built Scan2Study because so many course readings, especially older or scanned PDFs, are unreadable by AI tools out of the box. I kept running into situations where I wanted to use Claude or ChatGPT to study, but the PDF wasn't machine-readable, forcing a long, annoying workflow just to get text into an LLM. Scan2Study removes that friction by instantly parsing scanned PDFs and turning them into a chat-ready study companion. The goal is to help students understand dense readings faster through summaries, Q&A, and interactive explanations. It's built for speed, simplicity, and real-life student workflows.
          </p>
        </div>
      </main>
    </div>
  )
}

