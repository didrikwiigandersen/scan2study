"use client"

import Link from "next/link"
import { UploadPanel } from "@/components/UploadPanel"
import { BookOpen, GraduationCap, Book, School, PenTool, Notebook } from "lucide-react"

export default function Home() {
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

      {/* Floating School Icons - Full Screen with Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-[5%] rotate-12 animate-float" style={{ animationDelay: "0s", animationDuration: "6s" }}>
          <BookOpen className="w-8 h-8 text-gray-300" />
        </div>
        <div className="absolute top-32 right-[8%] -rotate-6 animate-float" style={{ animationDelay: "1s", animationDuration: "8s" }}>
          <GraduationCap className="w-12 h-12 text-gray-300" />
        </div>
        <div className="absolute bottom-32 left-[12%] rotate-45 animate-float" style={{ animationDelay: "2s", animationDuration: "7s" }}>
          <Book className="w-10 h-10 text-gray-300" />
        </div>
        <div className="absolute bottom-20 right-[15%] -rotate-12 animate-float" style={{ animationDelay: "0.5s", animationDuration: "9s" }}>
          <School className="w-9 h-9 text-gray-300" />
        </div>
        <div className="absolute top-1/3 left-[20%] rotate-24 animate-float" style={{ animationDelay: "1.5s", animationDuration: "6.5s" }}>
          <PenTool className="w-7 h-7 text-gray-300" />
        </div>
        <div className="absolute bottom-1/3 right-[22%] -rotate-18 animate-float" style={{ animationDelay: "2.5s", animationDuration: "8.5s" }}>
          <Notebook className="w-11 h-11 text-gray-300" />
        </div>
        <div className="absolute top-1/2 left-[8%] rotate-30 animate-float" style={{ animationDelay: "3s", animationDuration: "7.5s" }}>
          <BookOpen className="w-6 h-6 text-gray-300" />
        </div>
        <div className="absolute bottom-40 left-[25%] rotate-15 animate-float" style={{ animationDelay: "0.3s", animationDuration: "9.5s" }}>
          <GraduationCap className="w-8 h-8 text-gray-300" />
        </div>
        <div className="absolute top-1/4 right-[30%] rotate-20 animate-float" style={{ animationDelay: "1.2s", animationDuration: "6.8s" }}>
          <Book className="w-9 h-9 text-gray-300" />
        </div>
        <div className="absolute bottom-1/4 left-[35%] -rotate-25 animate-float" style={{ animationDelay: "2.2s", animationDuration: "8.2s" }}>
          <School className="w-7 h-7 text-gray-300" />
        </div>
        <div className="absolute top-2/3 right-[10%] rotate-35 animate-float" style={{ animationDelay: "0.8s", animationDuration: "7.2s" }}>
          <PenTool className="w-8 h-8 text-gray-300" />
        </div>
        <div className="absolute top-1/5 right-[25%] -rotate-10 animate-float" style={{ animationDelay: "1.8s", animationDuration: "9.2s" }}>
          <Notebook className="w-10 h-10 text-gray-300" />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative flex min-h-[calc(100vh-80px)] w-full max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-16 z-10">
        <div className="relative w-full max-w-2xl space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Turn PDFs into
              <br />
              <span className="text-gray-600">Study Companions</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
              Instantly parse scanned PDFs and transform them into an interactive study experience with AI-powered summaries and Q&A.
            </p>
          </div>

          {/* Upload Panel */}
          <div className="relative">
            <UploadPanel />
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Smart Parsing</h3>
              <p className="text-xs text-gray-600">Extract text from scanned PDFs instantly</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">AI Summaries</h3>
              <p className="text-xs text-gray-600">Get key insights automatically</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Interactive Q&A</h3>
              <p className="text-xs text-gray-600">Ask questions about your reading</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
