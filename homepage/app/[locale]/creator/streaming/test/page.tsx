import { CreatorStreamInterface } from '@/components/streaming/creator-stream-interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function CreatorStreamTestPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Streaming Studio</h1>
        <p className="text-muted-foreground mt-2">
          Start streaming directly from your browser - no downloads required
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Phase 1 Test:</strong> This is a test implementation of browser-based streaming. 
          AWS MediaLive integration requires proper AWS credentials to be configured in environment variables.
        </AlertDescription>
      </Alert>

      {/* Streaming Interface */}
      <CreatorStreamInterface />

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get started with live streaming in 3 easy steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Allow Camera & Microphone</h3>
              <p className="text-sm text-muted-foreground">
                Grant permission when prompted to access your camera and microphone
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Configure Your Stream</h3>
              <p className="text-sm text-muted-foreground">
                Add a title, description, and select your preferred quality settings
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Go Live!</h3>
              <p className="text-sm text-muted-foreground">
                Click "Go Live" to start streaming. Share the link with your viewers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}