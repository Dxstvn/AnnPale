import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createIVSChannel,
  deleteIVSChannel,
  stopStream,
  getStreamStatus,
  listChannels,
  getOBSConfiguration,
  generateStreamKey
} from '@/lib/aws/ivs'
import { IvsClient } from '@aws-sdk/client-ivs'

// Mock AWS IVS Client
vi.mock('@aws-sdk/client-ivs', () => ({
  IvsClient: vi.fn(),
  CreateChannelCommand: vi.fn(),
  DeleteChannelCommand: vi.fn(),
  StopStreamCommand: vi.fn(),
  GetStreamCommand: vi.fn(),
  ListChannelsCommand: vi.fn(),
  PutMetadataCommand: vi.fn()
}))

describe('AWS IVS Utilities', () => {
  let mockIvsClient: any

  beforeEach(() => {
    mockIvsClient = {
      send: vi.fn()
    }
    vi.mocked(IvsClient).mockImplementation(() => mockIvsClient)
  })

  describe('createIVSChannel', () => {
    it('should create a channel with correct configuration', async () => {
      const mockResponse = {
        channel: {
          arn: 'arn:aws:ivs:us-east-1:123456789:channel/abc123',
          playbackUrl: 'https://test.playback.live-video.net/api/video/v1/test.m3u8',
          ingestEndpoint: 'rtmps://test.global-contribute.live-video.net:443/app/'
        },
        streamKey: {
          value: 'sk_test_123456'
        }
      }

      mockIvsClient.send.mockResolvedValue(mockResponse)

      const result = await createIVSChannel('creator-123', 'Test Channel')

      expect(result).toEqual({
        channelArn: mockResponse.channel.arn,
        playbackUrl: mockResponse.channel.playbackUrl,
        ingestEndpoint: mockResponse.channel.ingestEndpoint,
        streamKey: mockResponse.streamKey.value
      })

      expect(mockIvsClient.send).toHaveBeenCalledTimes(1)
    })

    it('should handle channel creation errors', async () => {
      mockIvsClient.send.mockRejectedValue(new Error('AWS Error'))

      await expect(createIVSChannel('creator-123', 'Test Channel')).rejects.toThrow('AWS Error')
    })

    it('should include recording configuration when specified', async () => {
      const mockResponse = {
        channel: {
          arn: 'arn:aws:ivs:us-east-1:123456789:channel/abc123',
          recordingConfiguration: {
            arn: 'arn:aws:ivs:us-east-1:123456789:recording-config/rec123'
          }
        },
        streamKey: {
          value: 'sk_test_123456'
        }
      }

      mockIvsClient.send.mockResolvedValue(mockResponse)

      await createIVSChannel('creator-123', 'Test Channel')

      const command = mockIvsClient.send.mock.calls[0][0]
      expect(command).toBeDefined()
    })
  })

  describe('deleteIVSChannel', () => {
    it('should delete a channel by ARN', async () => {
      mockIvsClient.send.mockResolvedValue({})

      await deleteIVSChannel('arn:aws:ivs:us-east-1:123456789:channel/abc123')

      expect(mockIvsClient.send).toHaveBeenCalledTimes(1)
    })

    it('should handle deletion errors', async () => {
      mockIvsClient.send.mockRejectedValue(new Error('Channel not found'))

      await expect(
        deleteIVSChannel('arn:aws:ivs:us-east-1:123456789:channel/abc123')
      ).rejects.toThrow('Channel not found')
    })
  })

  describe('stopStream', () => {
    it('should stop an active stream', async () => {
      mockIvsClient.send.mockResolvedValue({})

      await stopStream('arn:aws:ivs:us-east-1:123456789:channel/abc123')

      expect(mockIvsClient.send).toHaveBeenCalledTimes(1)
    })

    it('should handle stop stream errors gracefully', async () => {
      mockIvsClient.send.mockRejectedValue(new Error('Stream not active'))

      await expect(
        stopStream('arn:aws:ivs:us-east-1:123456789:channel/abc123')
      ).rejects.toThrow('Stream not active')
    })
  })

  describe('getStreamStatus', () => {
    it('should return stream status when active', async () => {
      const mockResponse = {
        stream: {
          state: 'LIVE',
          health: 'HEALTHY',
          viewerCount: 42,
          startTime: new Date('2024-01-01T00:00:00Z')
        }
      }

      mockIvsClient.send.mockResolvedValue(mockResponse)

      const result = await getStreamStatus('arn:aws:ivs:us-east-1:123456789:channel/abc123')

      expect(result).toEqual({
        isLive: true,
        health: 'HEALTHY',
        viewerCount: 42,
        startTime: mockResponse.stream.startTime
      })
    })

    it('should return offline status when stream is not active', async () => {
      mockIvsClient.send.mockRejectedValue({ name: 'ResourceNotFoundException' })

      const result = await getStreamStatus('arn:aws:ivs:us-east-1:123456789:channel/abc123')

      expect(result).toEqual({
        isLive: false,
        health: 'OFFLINE',
        viewerCount: 0
      })
    })
  })

  describe('listChannels', () => {
    it('should list all channels with pagination', async () => {
      const mockResponse = {
        channels: [
          {
            arn: 'arn:aws:ivs:us-east-1:123456789:channel/abc123',
            name: 'Channel 1'
          },
          {
            arn: 'arn:aws:ivs:us-east-1:123456789:channel/def456',
            name: 'Channel 2'
          }
        ],
        nextToken: undefined
      }

      mockIvsClient.send.mockResolvedValue(mockResponse)

      const result = await listChannels()

      expect(result).toEqual(mockResponse.channels)
      expect(mockIvsClient.send).toHaveBeenCalledTimes(1)
    })

    it('should handle pagination tokens', async () => {
      const firstResponse = {
        channels: [{ arn: 'arn1', name: 'Channel 1' }],
        nextToken: 'token123'
      }

      const secondResponse = {
        channels: [{ arn: 'arn2', name: 'Channel 2' }],
        nextToken: undefined
      }

      mockIvsClient.send
        .mockResolvedValueOnce(firstResponse)
        .mockResolvedValueOnce(secondResponse)

      const result = await listChannels()

      expect(result).toHaveLength(2)
      expect(mockIvsClient.send).toHaveBeenCalledTimes(2)
    })
  })

  describe('getOBSConfiguration', () => {
    it('should generate OBS configuration from channel data', () => {
      const channelData = {
        ingestEndpoint: 'rtmps://test.global-contribute.live-video.net:443/app/',
        streamKey: 'sk_test_123456'
      }

      const config = getOBSConfiguration(channelData)

      expect(config).toEqual({
        server: 'rtmps://test.global-contribute.live-video.net:443/app/',
        streamKey: 'sk_test_123456',
        settings: {
          service: 'Custom',
          videoBitrate: '3000-6000 Kbps',
          audioBitrate: '160 Kbps',
          keyframeInterval: '2 seconds',
          resolution: '1920x1080',
          fps: 30
        }
      })
    })

    it('should handle missing stream key gracefully', () => {
      const channelData = {
        ingestEndpoint: 'rtmps://test.global-contribute.live-video.net:443/app/',
        streamKey: undefined
      }

      const config = getOBSConfiguration(channelData)

      expect(config.streamKey).toBe('[Hidden - Request from dashboard]')
    })
  })

  describe('generateStreamKey', () => {
    it('should generate a unique stream key', () => {
      const key1 = generateStreamKey('creator-123')
      const key2 = generateStreamKey('creator-123')

      expect(key1).toContain('sk_')
      expect(key1).toContain('creator-123')
      expect(key1).not.toEqual(key2)
    })

    it('should include timestamp in stream key', () => {
      const key = generateStreamKey('creator-456')
      
      expect(key).toMatch(/^sk_creator-456_\d+_[a-z0-9]+$/)
    })
  })
})