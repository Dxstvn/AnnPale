// AWS IVS (Interactive Video Service) Integration
// Handles live streaming infrastructure

import {
  CreateChannelCommand,
  DeleteChannelCommand,
  GetChannelCommand,
  GetStreamCommand,
  GetStreamKeyCommand,
  ListChannelsCommand,
  ListStreamKeysCommand,
  StopStreamCommand,
  CreateStreamKeyCommand,
  DeleteStreamKeyCommand,
  type Channel,
  type StreamKey,
  type Stream,
} from '@aws-sdk/client-ivs'
import { createAWSClients, getResourceName, ivsConfig, awsAccountConfig } from './config'
import type { LiveStream } from '@/lib/types/livestream'

// Create IVS channel for a creator
export async function createIVSChannel(creatorId: string, channelName: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new CreateChannelCommand({
      name: getResourceName('channel', creatorId),
      type: ivsConfig.channelType,
      latencyMode: ivsConfig.latencyMode,
      recordingConfigurationArn: ivsConfig.recordingEnabled 
        ? await getOrCreateRecordingConfig() 
        : undefined,
      tags: {
        creatorId,
        channelName,
        environment: process.env.NODE_ENV || 'development',
      },
    })

    const response = await ivs.send(command)
    
    if (!response.channel || !response.streamKey) {
      throw new Error('Failed to create IVS channel')
    }

    return {
      channel: response.channel,
      streamKey: response.streamKey,
    }
  } catch (error) {
    console.error('Error creating IVS channel:', error)
    throw new Error(`Failed to create IVS channel: ${error}`)
  }
}

// Get IVS channel details
export async function getIVSChannel(channelArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new GetChannelCommand({ arn: channelArn })
    const response = await ivs.send(command)
    
    return response.channel
  } catch (error) {
    console.error('Error getting IVS channel:', error)
    throw new Error(`Failed to get IVS channel: ${error}`)
  }
}

// Get stream key for a channel
export async function getStreamKey(streamKeyArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new GetStreamKeyCommand({ arn: streamKeyArn })
    const response = await ivs.send(command)
    
    return response.streamKey
  } catch (error) {
    console.error('Error getting stream key:', error)
    throw new Error(`Failed to get stream key: ${error}`)
  }
}

// Create new stream key for a channel
export async function createStreamKey(channelArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new CreateStreamKeyCommand({
      channelArn,
      tags: {
        createdAt: new Date().toISOString(),
      },
    })
    
    const response = await ivs.send(command)
    return response.streamKey
  } catch (error) {
    console.error('Error creating stream key:', error)
    throw new Error(`Failed to create stream key: ${error}`)
  }
}

// Revoke (delete) a stream key
export async function revokeStreamKey(streamKeyArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new DeleteStreamKeyCommand({ arn: streamKeyArn })
    await ivs.send(command)
    
    return { success: true }
  } catch (error) {
    console.error('Error revoking stream key:', error)
    throw new Error(`Failed to revoke stream key: ${error}`)
  }
}

// Get stream information (for active streams)
export async function getStreamInfo(channelArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new GetStreamCommand({ channelArn })
    const response = await ivs.send(command)
    
    return response.stream
  } catch (error: any) {
    // Stream might not be active
    if (error.name === 'ChannelNotBroadcasting') {
      return null
    }
    console.error('Error getting stream info:', error)
    throw new Error(`Failed to get stream info: ${error}`)
  }
}

// Stop an active stream
export async function stopStream(channelArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new StopStreamCommand({ channelArn })
    await ivs.send(command)
    
    return { success: true }
  } catch (error: any) {
    // Stream might not be active
    if (error.name === 'ChannelNotBroadcasting') {
      return { success: true, alreadyStopped: true }
    }
    console.error('Error stopping stream:', error)
    throw new Error(`Failed to stop stream: ${error}`)
  }
}

// Delete IVS channel
export async function deleteIVSChannel(channelArn: string) {
  const { ivs } = createAWSClients()
  
  try {
    // First, stop any active stream
    await stopStream(channelArn)
    
    // Delete the channel
    const command = new DeleteChannelCommand({ arn: channelArn })
    await ivs.send(command)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting IVS channel:', error)
    throw new Error(`Failed to delete IVS channel: ${error}`)
  }
}

// List all channels (for admin dashboard)
export async function listIVSChannels(nextToken?: string) {
  const { ivs } = createAWSClients()
  
  try {
    const command = new ListChannelsCommand({
      maxResults: 50,
      nextToken,
    })
    
    const response = await ivs.send(command)
    return {
      channels: response.channels || [],
      nextToken: response.nextToken,
    }
  } catch (error) {
    console.error('Error listing IVS channels:', error)
    throw new Error(`Failed to list IVS channels: ${error}`)
  }
}

// Helper: Get or create recording configuration
async function getOrCreateRecordingConfig(): Promise<string | undefined> {
  // For now, return undefined. In production, you'd create a recording configuration
  // that saves streams to S3
  return undefined
}

// Helper: Generate streaming URLs for a channel
export function generateStreamingURLs(channel: Channel) {
  if (!channel.playbackUrl || !channel.ingestEndpoint) {
    throw new Error('Channel missing required URLs')
  }

  return {
    playbackUrl: channel.playbackUrl,
    ingestEndpoint: channel.ingestEndpoint,
    rtmpUrl: `rtmps://${channel.ingestEndpoint}:443/app/`,
    webRTCUrl: `https://${channel.ingestEndpoint}`,
  }
}

// Helper: Calculate streaming costs (estimates)
export function estimateStreamingCosts(
  viewerHours: number,
  streamHours: number,
  region: string = 'us-east-1'
) {
  // IVS Pricing (as of 2024)
  const pricing = {
    channelHour: {
      standard: 2.00,  // $2.00 per hour for STANDARD channel
      basic: 0.50,     // $0.50 per hour for BASIC channel
    },
    viewerHour: {
      first10000: 0.15,     // $0.15 per viewer hour (first 10,000)
      next40000: 0.10,      // $0.10 per viewer hour (next 40,000)
      beyond50000: 0.05,    // $0.05 per viewer hour (beyond 50,000)
    },
  }

  // Calculate channel costs
  const channelCost = streamHours * pricing.channelHour[ivsConfig.channelType.toLowerCase() as 'standard' | 'basic']

  // Calculate viewer costs (tiered pricing)
  let viewerCost = 0
  if (viewerHours <= 10000) {
    viewerCost = viewerHours * pricing.viewerHour.first10000
  } else if (viewerHours <= 50000) {
    viewerCost = (10000 * pricing.viewerHour.first10000) + 
                 ((viewerHours - 10000) * pricing.viewerHour.next40000)
  } else {
    viewerCost = (10000 * pricing.viewerHour.first10000) + 
                 (40000 * pricing.viewerHour.next40000) + 
                 ((viewerHours - 50000) * pricing.viewerHour.beyond50000)
  }

  return {
    channelCost,
    viewerCost,
    totalCost: channelCost + viewerCost,
    breakdown: {
      channelType: ivsConfig.channelType,
      streamHours,
      viewerHours,
      region,
    },
  }
}

// Helper: Validate stream key format
export function validateStreamKey(streamKey: string): boolean {
  // IVS stream keys are typically 40+ characters
  return streamKey.length >= 40 && /^[a-zA-Z0-9_-]+$/.test(streamKey)
}

// Helper: Generate OBS Studio configuration
export function generateOBSConfig(ingestEndpoint: string, streamKey: string) {
  return {
    settings: {
      service: 'Amazon IVS',
      server: `rtmps://${ingestEndpoint}:443/app/`,
      streamKey: streamKey,
    },
    recommended: {
      videoBitrate: 3000,      // 3 Mbps
      audioBitrate: 160,       // 160 Kbps
      resolution: '1920x1080', // 1080p
      fps: 30,
      keyframeInterval: 2,     // 2 seconds
      encoder: 'x264',
      profile: 'main',
      preset: 'veryfast',
    },
  }
}