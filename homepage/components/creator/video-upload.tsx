'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Video, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileVideo,
  Loader2
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface VideoUploadProps {
  orderId: string
  onUploadComplete: (data: {
    orderId: string
    videoUrl: string
    fileName: string
    metadata: any
  }) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
}

export function VideoUpload({ 
  orderId, 
  onUploadComplete, 
  onUploadError,
  disabled = false 
}: VideoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi']
  const maxSizeMB = 500
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload MP4, WebM, QuickTime, or AVI files only.'
    }
    
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`
    }
    
    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      toast({
        title: 'Invalid File',
        description: error,
        variant: 'destructive'
      })
      return
    }
    
    setSelectedFile(file)
    setUploadStatus('idle')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress < 90) {
        setUploadProgress(progress)
      } else {
        clearInterval(interval)
      }
    }, 200)
    return interval
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate progress for better UX
    const progressInterval = simulateProgress()

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('orderId', orderId)

      const response = await fetch('/api/creator/videos/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadStatus('success')
      toast({
        title: 'Success!',
        description: 'Video uploaded successfully. Order status updated.',
      })

      onUploadComplete(data.data)

    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive'
      })

      onUploadError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setUploadStatus('idle')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (uploadStatus === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-8 w-8" />
            <div className="text-center">
              <p className="font-semibold">Video Uploaded Successfully!</p>
              <p className="text-sm text-green-600/80">Order status has been updated to in progress.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Upload Video</h3>
          </div>

          {!selectedFile ? (
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragOver 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your video here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports MP4, WebM, QuickTime, and AVI files up to {maxSizeMB}MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/avi"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileVideo className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Upload failed. Please try again.</span>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || disabled}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Video will be securely stored and only accessible to you and the customer</p>
            <p>• Supported formats: MP4, WebM, QuickTime, AVI</p>
            <p>• Maximum file size: {maxSizeMB}MB</p>
            <p>• Order status will automatically update to "In Progress" after upload</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}