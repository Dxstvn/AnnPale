# Browser Streaming Implementation Plan for Ann Pale

## Recommended Approach: Hybrid Progressive Enhancement

### Phase 1: Basic Browser Streaming (Week 1)
**Implement MediaRecorder API → Server → AWS IVS**

```typescript
// Frontend: /app/creator/streaming/live/page.tsx
const BrowserStreaming = () => {
  const [isLive, setIsLive] = useState(false)
  
  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 1280,  // Start with 720p for browser
        height: 720,
        frameRate: 30 
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    })
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=h264,opus',  // Better compatibility
      videoBitsPerSecond: 2500000  // 2.5 Mbps
    })
    
    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        const formData = new FormData()
        formData.append('chunk', event.data)
        formData.append('streamId', streamId)
        
        await fetch('/api/streaming/browser-chunk', {
          method: 'POST',
          body: formData
        })
      }
    }
    
    mediaRecorder.start(2000)  // 2-second chunks
    setIsLive(true)
  }
}

// Backend: /app/api/streaming/browser-chunk/route.ts
import ffmpeg from 'fluent-ffmpeg'

export async function POST(request: Request) {
  const formData = await request.formData()
  const chunk = formData.get('chunk') as Blob
  const streamId = formData.get('streamId')
  
  // Get creator's IVS endpoint
  const { rtmpUrl, streamKey } = await getCreatorStreamConfig(streamId)
  
  // Convert WebM to RTMP using FFmpeg
  const command = ffmpeg()
    .input(chunk.stream())
    .inputFormat('webm')
    .outputOptions([
      '-c:v libx264',
      '-preset ultrafast',
      '-tune zerolatency',
      '-c:a aac',
      '-f flv'
    ])
    .output(`${rtmpUrl}/${streamKey}`)
    
  command.run()
  
  return Response.json({ success: true })
}
```

**Pros:**
- Works today with existing AWS IVS
- No OBS needed
- Mobile friendly
- 5-10 second latency (acceptable)

**Cons:**
- Needs server processing
- Higher server costs

### Phase 2: WebRTC Enhancement (Month 2)
**Add WebRTC for ultra-low latency**

```typescript
// Use AWS IVS WebRTC (when available) or Daily.co
const WebRTCStreaming = () => {
  const startWebRTCStream = async () => {
    // Option A: AWS IVS WebRTC (if in your region)
    const response = await fetch('/api/streaming/ivs-webrtc-stage')
    const { stageArn, participantToken } = await response.json()
    
    const stage = new IVSBroadcastClient({
      stageArn,
      participantToken
    })
    
    await stage.startBroadcast(stream)
    
    // Option B: Daily.co fallback
    if (!stageArn) {
      const call = Daily.createCallObject()
      await call.join({ url: dailyRoomUrl })
      await call.startRecording({
        streamToRTMP: { rtmpUrl: AWS_IVS_RTMP }
      })
    }
  }
}
```

### Phase 3: Progressive Feature Enhancement (Month 3)
**Add professional features while keeping it browser-based**

```typescript
interface BrowserStreamFeatures {
  // Basic (Phase 1)
  camera: boolean
  microphone: boolean
  
  // Enhanced (Phase 2)
  screenShare: boolean
  pictureInPicture: boolean
  
  // Professional (Phase 3)
  virtualBackground: boolean
  overlays: boolean
  multiCamera: boolean
  guestInvites: boolean
}

// Virtual backgrounds without OBS
const VirtualBackground = () => {
  useEffect(() => {
    // Use TensorFlow.js BodyPix for background removal
    const loadBodyPix = async () => {
      const net = await bodyPix.load()
      const segmentation = await net.segmentPerson(video)
      // Apply blur or virtual background
    }
  }, [])
}

// Browser-based overlays
const StreamOverlays = () => {
  return (
    <div className="stream-container">
      <video ref={videoRef} />
      <div className="overlay-top">
        <img src="/logo.png" />
        <span>LIVE</span>
      </div>
      <div className="overlay-bottom">
        <h3>{creatorName}</h3>
        <div>❤️ {viewerCount} watching</div>
      </div>
    </div>
  )
}
```

## Feature Comparison

| Feature | OBS | Basic Browser | Enhanced Browser |
|---------|-----|--------------|------------------|
| Setup Time | 10-15 min | 0 min | 0 min |
| Software Required | Yes | No | No |
| Works on Mobile | No | Yes | Yes |
| Latency | 2-3s | 5-10s | <1s (WebRTC) |
| Screen Share | Yes | Yes | Yes |
| Virtual Background | Yes | No | Yes (Phase 3) |
| Multiple Scenes | Yes | No | Yes (Phase 3) |
| Guest Interviews | Plugin | No | Yes (Phase 3) |
| Stream Quality | Excellent | Good | Very Good |
| CPU Usage | High | Low | Medium |

## Cost Analysis

### Current (OBS → AWS IVS)
- AWS IVS: $0.20/hour
- Bandwidth: $0.015/GB
- **Monthly (100 hours):** ~$30

### Browser Streaming Option 1 (MediaRecorder → Server → AWS IVS)
- AWS IVS: $0.20/hour
- Server processing: ~$50/month (EC2)
- Bandwidth: $0.015/GB
- **Monthly (100 hours):** ~$80

### Browser Streaming Option 2 (WebRTC via Daily.co)
- Daily.co: $0.004/minute = $0.24/hour
- No server needed
- **Monthly (100 hours):** ~$24

### Browser Streaming Option 3 (Mux WebRTC)
- Mux: $0.13/hour
- No server needed
- **Monthly (100 hours):** ~$13 (cheapest!)

## Recommended Implementation Path

### Week 1: Basic Browser Streaming
1. Implement camera/mic capture
2. MediaRecorder API chunking
3. Server-side FFmpeg processing
4. Push to existing AWS IVS

### Week 2: Enhanced UI
1. Add screen sharing
2. Picture-in-picture for screen + camera
3. Stream preview before going live
4. Basic overlays (logo, "LIVE" badge)

### Month 2: WebRTC Migration
1. Evaluate AWS IVS WebRTC availability
2. Implement Daily.co or Mux as alternative
3. Reduce latency to <1 second
4. Add viewer interaction features

### Month 3: Professional Features
1. Virtual backgrounds (TensorFlow.js)
2. Multiple scenes (switcher UI)
3. Guest invites for interviews
4. Stream recording and clips

## User Experience Flow

### Current (OBS):
1. Download OBS ❌
2. Install OBS ❌
3. Configure settings ❌
4. Copy/paste credentials ❌
5. Add sources ❌
6. Start streaming

**Time to first stream: 15-30 minutes**

### New (Browser):
1. Click "Go Live" ✅
2. Allow camera/mic ✅
3. Start streaming ✅

**Time to first stream: 30 seconds**

## The Bottom Line

**Browser streaming is 100% feasible and practical.** In fact, it's superior for user experience:

- **Creators can start streaming in 30 seconds** vs 30 minutes
- **Works on any device** (laptop, phone, tablet)
- **No technical knowledge required**
- **Still profitable** (Mux is actually cheaper than AWS IVS)

## Next Steps

1. Keep OBS as "Pro" option for power users
2. Implement browser streaming as default
3. Start with MediaRecorder → Server → AWS IVS (works today)
4. Migrate to WebRTC for better latency
5. Add features progressively based on user feedback

The future is browser-based. OBS becomes optional, not required.