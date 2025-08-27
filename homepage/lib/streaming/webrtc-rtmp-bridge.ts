/**
 * WebRTC to RTMP Bridge Server
 * Handles browser WebRTC streams and converts them to RTMP for AWS MediaLive
 */

import { EventEmitter } from 'events';

export interface StreamConfig {
  streamId: string;
  userId: string;
  rtmpUrl: string;
  streamKey: string;
  quality?: 'HD-720p' | 'SD-540p' | 'SD-360p';
}

export interface WebRTCOffer {
  type: 'offer';
  sdp: string;
}

export interface WebRTCAnswer {
  type: 'answer';
  sdp: string;
}

export class WebRTCToRTMPBridge extends EventEmitter {
  private activeStreams: Map<string, StreamConfig> = new Map();
  private peerConnections: Map<string, RTCPeerConnection> = new Map();

  constructor() {
    super();
  }

  /**
   * Initialize a new WebRTC stream
   */
  async initializeStream(config: StreamConfig, offer: WebRTCOffer): Promise<WebRTCAnswer> {
    const { streamId } = config;

    // Store stream configuration
    this.activeStreams.set(streamId, config);

    // Create peer connection with STUN/TURN servers
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for better connectivity
        ...(process.env.TURN_SERVER_URL ? [{
          urls: process.env.TURN_SERVER_URL,
          username: process.env.TURN_USERNAME,
          credential: process.env.TURN_CREDENTIAL
        }] : [])
      ]
    });

    // Store peer connection
    this.peerConnections.set(streamId, peerConnection);

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.emit('ice-candidate', { streamId, candidate: event.candidate });
      }
    };

    // Handle incoming media stream
    peerConnection.ontrack = (event) => {
      this.handleIncomingStream(streamId, event.streams[0]);
    };

    // Set remote description
    await peerConnection.setRemoteDescription(offer);

    // Create answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    return answer;
  }

  /**
   * Handle incoming WebRTC media stream and convert to RTMP
   */
  private async handleIncomingStream(streamId: string, mediaStream: MediaStream) {
    const config = this.activeStreams.get(streamId);
    if (!config) {
      console.error(`Stream config not found for ${streamId}`);
      return;
    }

    try {
      // Start RTMP conversion using FFmpeg
      await this.startFFmpegConversion(config, mediaStream);
      
      // Emit stream started event
      this.emit('stream-started', { streamId, rtmpUrl: config.rtmpUrl });
    } catch (error) {
      console.error(`Failed to start RTMP conversion for ${streamId}:`, error);
      this.emit('stream-error', { streamId, error });
    }
  }

  /**
   * Start FFmpeg process to convert WebRTC to RTMP
   * This will be implemented with actual FFmpeg integration
   */
  private async startFFmpegConversion(config: StreamConfig, mediaStream: MediaStream): Promise<void> {
    const { rtmpUrl, streamKey, quality = 'HD-720p' } = config;

    // Get encoding settings based on quality
    const encodingSettings = this.getEncodingSettings(quality);

    // Full RTMP URL with stream key
    const fullRtmpUrl = `${rtmpUrl}/${streamKey}`;

    // In production, this would spawn an FFmpeg process
    // For now, we'll prepare the command that would be used
    const ffmpegCommand = [
      '-f', 'webm',           // Input format from WebRTC
      '-i', 'pipe:0',         // Read from stdin
      '-c:v', 'libx264',      // Video codec
      '-preset', 'veryfast',  // Encoding speed
      '-tune', 'zerolatency', // Low latency
      '-c:a', 'aac',          // Audio codec
      '-b:a', '128k',         // Audio bitrate
      ...encodingSettings,    // Quality-specific settings
      '-f', 'flv',           // Output format for RTMP
      fullRtmpUrl            // RTMP destination
    ];

    console.log(`Would execute FFmpeg with: ffmpeg ${ffmpegCommand.join(' ')}`);

    // Simulate successful stream start
    this.emit('ffmpeg-started', { streamId: config.streamId, command: ffmpegCommand });
  }

  /**
   * Get encoding settings based on quality preset
   */
  private getEncodingSettings(quality: string): string[] {
    const settings: Record<string, string[]> = {
      'HD-720p': [
        '-s', '1280x720',
        '-b:v', '2500k',
        '-maxrate', '2500k',
        '-bufsize', '5000k',
        '-r', '30',
        '-g', '60',
        '-keyint_min', '60'
      ],
      'SD-540p': [
        '-s', '960x540',
        '-b:v', '1500k',
        '-maxrate', '1500k',
        '-bufsize', '3000k',
        '-r', '30',
        '-g', '60',
        '-keyint_min', '60'
      ],
      'SD-360p': [
        '-s', '640x360',
        '-b:v', '800k',
        '-maxrate', '800k',
        '-bufsize', '1600k',
        '-r', '30',
        '-g', '60',
        '-keyint_min', '60'
      ]
    };

    return settings[quality] || settings['HD-720p'];
  }

  /**
   * Add ICE candidate to peer connection
   */
  async addIceCandidate(streamId: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnections.get(streamId);
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  }

  /**
   * Stop a stream
   */
  stopStream(streamId: string): void {
    // Close peer connection
    const peerConnection = this.peerConnections.get(streamId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(streamId);
    }

    // Remove stream config
    this.activeStreams.delete(streamId);

    // Emit stream stopped event
    this.emit('stream-stopped', { streamId });
  }

  /**
   * Get stream statistics
   */
  async getStreamStats(streamId: string): Promise<RTCStatsReport | null> {
    const peerConnection = this.peerConnections.get(streamId);
    if (peerConnection) {
      return await peerConnection.getStats();
    }
    return null;
  }

  /**
   * Get all active streams
   */
  getActiveStreams(): StreamConfig[] {
    return Array.from(this.activeStreams.values());
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.activeStreams.clear();
    this.removeAllListeners();
  }
}

// Singleton instance
let bridgeInstance: WebRTCToRTMPBridge | null = null;

export function getWebRTCBridge(): WebRTCToRTMPBridge {
  if (!bridgeInstance) {
    bridgeInstance = new WebRTCToRTMPBridge();
  }
  return bridgeInstance;
}