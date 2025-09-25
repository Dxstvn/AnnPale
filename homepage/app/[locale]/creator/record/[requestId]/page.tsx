'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { VideoRecorder } from '@/components/video/VideoRecorder'
import { VideoRequest } from '@/types/video'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, User, Calendar, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

export default function CreatorRecordPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [request, setRequest] = useState<VideoRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const supabase = createClient()

  const requestId = params.requestId as string

  useEffect(() => {
    if (requestId) {
      fetchRequest()
    }
  }, [requestId])

  const fetchRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('video_requests')
        .select(`
          *,
          fan:fan_id(
            id,
            username,
            display_name,
            name,
            avatar_url
          )
        `)
        .eq('id', requestId)
        .eq('creator_id', user.id)
        .single()

      if (error) throw error
      
      if (!data) {
        toast({
          title: 'Request not found',
          description: 'This request does not exist or you do not have access to it.',
          variant: 'destructive'
        })
        router.push('/creator/requests')
        return
      }

      // Update status to recording if it's accepted
      if (data.status === 'accepted') {
        await supabase
          .from('video_requests')
          .update({ status: 'recording' })
          .eq('id', requestId)
        
        data.status = 'recording'
      }

      setRequest(data)
    } catch (error: any) {
      console.error('Error fetching request:', error)
      toast({
        title: 'Error',
        description: 'Failed to load video request',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (videoBlob: Blob) => {
    if (!request) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', videoBlob, `video-${requestId}.webm`)
      formData.append('request_id', requestId)

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()

      // The API already updated the request status to completed
      setRecordingComplete(true)
      
      toast({
        title: 'Success!',
        description: 'Video uploaded successfully. The fan will be notified.',
      })

      // Redirect to requests page after a short delay
      setTimeout(() => {
        router.push('/creator/requests')
      }, 2000)

    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload video. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container max-w-6xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Request not found</AlertTitle>
          <AlertDescription>
            This request could not be found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const isOverdue = request.deadline && isPast(new Date(request.deadline))

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/creator/requests')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Record Video</h1>
            <p className="text-muted-foreground">
              Create a personalized video for {request.recipient_name}
            </p>
          </div>
          <Badge variant={isOverdue ? 'destructive' : 'default'}>
            {isOverdue ? 'Overdue' : 'Recording'}
          </Badge>
        </div>
      </div>

      {/* Success Message */}
      {recordingComplete && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Video Uploaded Successfully!</AlertTitle>
          <AlertDescription>
            The video has been delivered to the fan. Redirecting to your requests...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Request Details - Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Request Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>Information about this video request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">
                      {request.fan?.display_name || request.fan?.name || request.fan?.username || 'Anonymous'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium">
                      {formatCurrency(request.price || 0, 'USD')}
                    </p>
                  </div>
                </div>

                {request.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">
                        {format(new Date(request.deadline), 'PPP')}
                      </p>
                      {isOverdue && (
                        <p className="text-xs text-destructive">Overdue!</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requested</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(request.created_at))} ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Script/Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Script & Notes</CardTitle>
              <CardDescription>Keep these points in mind while recording</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="tips">Recording Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="space-y-3">
                  <div>
                    <p className="font-medium mb-2">Occasion: {request.occasion}</p>
                    <p className="font-medium mb-2">Recipient: {request.recipient_name}</p>
                  </div>
                  {request.instructions ? (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">{request.instructions}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific instructions provided. Create a heartfelt {request.occasion} message for {request.recipient_name}.
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-3">
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Start with their name for a personal touch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Speak clearly and maintain eye contact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Keep it between 30 seconds to 2 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>End with a warm closing and your signature phrase</span>
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Video Recorder - Right Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Record Your Video</CardTitle>
              <CardDescription>
                Create a personalized video message for {request.recipient_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoRecorder
                request={request}
                maxDuration={180} // 3 minutes max
                onRecordingComplete={(blob, duration) => {
                  console.log('Recording complete:', { size: blob.size, duration })
                }}
                onUpload={handleUpload}
              />
              
              {uploading && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4 animate-spin" />
                  <AlertTitle>Uploading...</AlertTitle>
                  <AlertDescription>
                    Please wait while your video is being uploaded. This may take a few moments.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}