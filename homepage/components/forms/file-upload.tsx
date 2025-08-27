"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Upload, 
  X, 
  File, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  FileText,
  Cloud,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// File upload zone
interface FileUploadZoneProps {
  onFilesSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
}

export function FileUploadZone({
  onFilesSelect,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  disabled = false,
  className
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  const validateFiles = (files: File[]) => {
    setError(null)
    
    if (!multiple && files.length > 1) {
      setError("Only one file allowed")
      return []
    }
    
    if (multiple && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return []
    }
    
    const validFiles: File[] = []
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`)
        continue
      }
      validFiles.push(file)
    }
    
    return validFiles
  }
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (disabled) return
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onFilesSelect(validFiles)
    }
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = validateFiles(files)
    if (validFiles.length > 0) {
      onFilesSelect(validFiles)
    }
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging 
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" 
            : "border-gray-300 dark:border-gray-700 hover:border-purple-400",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        
        <p className="text-lg font-medium mb-2">
          {isDragging ? "Drop files here" : "Click or drag files to upload"}
        </p>
        
        <p className="text-sm text-gray-500">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          {multiple && maxFiles && ` • Max ${maxFiles} files`}
        </p>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}

// File preview item
interface FilePreviewProps {
  file: File
  onRemove?: () => void
  uploadProgress?: number
  uploadStatus?: "pending" | "uploading" | "success" | "error"
  errorMessage?: string
}

export function FilePreview({
  file,
  onRemove,
  uploadProgress = 0,
  uploadStatus = "pending",
  errorMessage
}: FilePreviewProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [file])
  
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return FileImage
    if (file.type.startsWith("video/")) return FileVideo
    if (file.type.startsWith("audio/")) return FileAudio
    if (file.type.startsWith("text/") || file.type.includes("pdf")) return FileText
    return File
  }
  
  const FileIcon = getFileIcon()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      {/* File icon or preview */}
      <div className="flex-shrink-0">
        {preview ? (
          <img
            src={preview}
            alt={file.name}
            className="h-12 w-12 object-cover rounded"
          />
        ) : (
          <FileIcon className="h-12 w-12 text-gray-400" />
        )}
      </div>
      
      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        
        {/* Upload progress */}
        {uploadStatus === "uploading" && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="h-1" />
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}
        
        {/* Error message */}
        {uploadStatus === "error" && errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
      
      {/* Status/Action */}
      <div className="flex-shrink-0">
        {uploadStatus === "pending" && onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {uploadStatus === "uploading" && (
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
        )}
        
        {uploadStatus === "success" && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        
        {uploadStatus === "error" && (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
    </motion.div>
  )
}

// Multiple file upload manager
interface FileUploadManagerProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<void>
  accept?: string
  maxSize?: number
  maxFiles?: number
  className?: string
}

export function FileUploadManager({
  files,
  onFilesChange,
  onUpload,
  accept,
  maxSize,
  maxFiles = 10,
  className
}: FileUploadManagerProps) {
  const [uploadStatuses, setUploadStatuses] = React.useState<
    Record<string, { progress: number; status: "pending" | "uploading" | "success" | "error"; error?: string }>
  >({})
  
  const handleFilesSelect = (newFiles: File[]) => {
    const totalFiles = files.length + newFiles.length
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }
    onFilesChange([...files, ...newFiles])
  }
  
  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }
  
  const handleUploadAll = async () => {
    if (!onUpload) return
    
    // Set all files to uploading
    const initialStatuses: typeof uploadStatuses = {}
    files.forEach((file, index) => {
      initialStatuses[index] = { progress: 0, status: "uploading" }
    })
    setUploadStatuses(initialStatuses)
    
    // Simulate upload progress
    for (let i = 0; i < files.length; i++) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadStatuses(prev => ({
          ...prev,
          [i]: { ...prev[i], progress }
        }))
      }
      setUploadStatuses(prev => ({
        ...prev,
        [i]: { progress: 100, status: "success" }
      }))
    }
    
    // Call actual upload function
    try {
      await onUpload(files)
    } catch (error) {
      // Handle error
      console.error("Upload error:", error)
    }
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload zone */}
      {files.length < maxFiles && (
        <FileUploadZone
          onFilesSelect={handleFilesSelect}
          accept={accept}
          multiple={true}
          maxSize={maxSize}
          maxFiles={maxFiles - files.length}
        />
      )}
      
      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            {onUpload && (
              <Button
                onClick={handleUploadAll}
                size="sm"
                variant="primary"
                disabled={Object.values(uploadStatuses).some(s => s.status === "uploading")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload All
              </Button>
            )}
          </div>
          
          <AnimatePresence>
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => handleRemoveFile(index)}
                uploadProgress={uploadStatuses[index]?.progress}
                uploadStatus={uploadStatuses[index]?.status}
                errorMessage={uploadStatuses[index]?.error}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// Image upload with preview
interface ImageUploadProps {
  value?: string | File
  onChange: (file: File | null) => void
  maxSize?: number
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  className
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  React.useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(value)
    } else if (typeof value === "string") {
      setPreview(value)
    } else {
      setPreview(null)
    }
  }, [value])
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > maxSize) {
      alert(`File size must be less than ${formatFileSize(maxSize)}`)
      return
    }
    
    onChange(file)
  }
  
  const handleRemove = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Upload preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group"
        >
          <Upload className="h-8 w-8 text-purple-400 group-hover:text-purple-600 mb-2 transition-colors" />
          <span className="text-xs text-gray-600 group-hover:text-gray-700 font-medium">Upload Image</span>
        </button>
      )}
    </div>
  )
}

// Utility function
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}