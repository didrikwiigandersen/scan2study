"use client"

import { UploadPanel } from "@/components/UploadPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Main Content */}
      <main className="flex min-h-screen w-full max-w-3xl mx-auto flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-16">
        <div className="w-full max-w-2xl">
          <UploadPanel />
        </div>
      </main>
    </div>
  );
}
