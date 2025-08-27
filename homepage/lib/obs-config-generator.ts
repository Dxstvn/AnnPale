// OBS Configuration Generator
// Generates downloadable OBS profile with pre-configured settings

export interface OBSConfig {
  streamKey: string
  serverUrl: string
  creatorName: string
}

export function generateOBSProfile(config: OBSConfig) {
  // OBS Scene Collection JSON format
  const sceneCollection = {
    "name": `AnnPale - ${config.creatorName}`,
    "current_scene": "Main Scene",
    "current_program_scene": "Main Scene",
    "scene_order": [
      {
        "name": "Main Scene"
      },
      {
        "name": "Starting Soon"
      },
      {
        "name": "Be Right Back"
      },
      {
        "name": "Stream Ending"
      }
    ],
    "sources": [
      {
        "name": "Webcam",
        "type": "v4l2_input",
        "settings": {
          "device_id": "/dev/video0",
          "resolution": "1920x1080",
          "framerate": 30
        }
      },
      {
        "name": "Desktop Audio",
        "type": "pulse_output_capture",
        "settings": {}
      },
      {
        "name": "Microphone",
        "type": "pulse_input_capture",
        "settings": {}
      }
    ]
  }

  // OBS Profile settings (basic.ini format)
  const profileSettings = `
[General]
Name=AnnPale Stream Profile

[Video]
BaseCX=1920
BaseCY=1080
OutputCX=1920
OutputCY=1080
FPSType=0
FPSCommon=30

[Output]
Mode=Simple
StreamEncoder=x264
RecordingPath=/home/Videos
RecordingFormat=mp4
VBitrate=4500
ABitrate=160

[Audio]
SampleRate=48000
ChannelSetup=Stereo`

  // Stream settings (service.json format)
  const streamSettings = {
    "settings": {
      "service": "Custom",
      "server": config.serverUrl,
      "key": config.streamKey
    }
  }

  return {
    sceneCollection,
    profileSettings,
    streamSettings
  }
}

export function downloadOBSConfig(config: OBSConfig) {
  const { sceneCollection, profileSettings, streamSettings } = generateOBSProfile(config)
  
  // Create a zip file with all configs
  // In a real implementation, use a library like JSZip
  const configs = [
    {
      filename: 'scenes.json',
      content: JSON.stringify(sceneCollection, null, 2)
    },
    {
      filename: 'basic.ini',
      content: profileSettings
    },
    {
      filename: 'service.json',
      content: JSON.stringify(streamSettings, null, 2)
    },
    {
      filename: 'README.txt',
      content: `ANN PALE OBS CONFIGURATION
==========================

Installation Instructions:
1. Open OBS Studio
2. Go to Profile > Import
3. Select this folder
4. Your stream will be automatically configured!

Stream Settings:
- Resolution: 1920x1080 @ 30fps
- Bitrate: 4500 Kbps
- Audio: 160 Kbps

Your stream key is already configured.
Just click "Start Streaming" to go live!

Need help? Visit: https://annpale.com/help/streaming
`
    }
  ]

  // Download as individual files or as a zip
  return configs
}

// Generate OBS WebSocket config for remote control
export function generateOBSWebSocketConfig(password: string) {
  return {
    "obs_websocket_enabled": true,
    "obs_websocket_port": 4455,
    "obs_websocket_password": password,
    "obs_websocket_auth_required": true
  }
}

// Generate stream key with metadata
export function generateStreamKeyWithMetadata(creatorId: string) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  
  return {
    streamKey: `sk_${creatorId}_${timestamp}_${random}`,
    metadata: {
      creatorId,
      generatedAt: new Date(timestamp).toISOString(),
      platform: 'AnnPale',
      version: '1.0'
    }
  }
}