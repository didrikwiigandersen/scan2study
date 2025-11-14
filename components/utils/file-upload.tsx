"use client"

import * as React from "react"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void
  className?: string
  accept?: string
}

export function FileUpload({ onFileSelect, className, accept }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border rounded-lg p-8 sm:p-12 transition-all cursor-pointer",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragging && "border-primary bg-accent/50",
          selectedFile && "border-primary/50 bg-accent/30"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={accept}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <File className="w-6 h-6 text-primary" />
              </div>
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

