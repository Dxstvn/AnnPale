/**
 * AWS MediaLive Channel Manager
 * Handles MediaLive channel creation, configuration, and management
 */

import {
  MediaLiveClient,
  CreateChannelCommand,
  StartChannelCommand,
  StopChannelCommand,
  DeleteChannelCommand,
  DescribeChannelCommand,
  CreateInputCommand,
  DeleteInputCommand,
  CreateInputSecurityGroupCommand,
  DeleteInputSecurityGroupCommand,
  type Channel,
  type Input,
  type InputSecurityGroup,
  type ChannelState,
  type OutputDestination,
  type EncoderSettings,
  type VideoDescription,
  type AudioDescription
} from '@aws-sdk/client-medialive';

export interface MediaLiveConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface ChannelConfig {
  name: string;
  encodingProfile: 'HD-720p' | 'SD-540p' | 'SD-360p';
  inputType: 'RTMP_PUSH' | 'RTP_PUSH' | 'URL_PULL';
  s3BucketName: string;
  s3Prefix: string;
}

export interface StreamEndpoints {
  rtmpUrl: string;
  streamKey: string;
  playbackUrl: string;
}

export class MediaLiveManager {
  private client: MediaLiveClient;
  private activeChannels: Map<string, Channel> = new Map();
  private activeInputs: Map<string, Input> = new Map();

  constructor(config: MediaLiveConfig) {
    this.client = new MediaLiveClient({
      region: config.region,
      credentials: config.accessKeyId && config.secretAccessKey ? {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      } : undefined
    });
  }

  /**
   * Create a MediaLive channel for streaming
   */
  async createChannel(streamId: string, config: ChannelConfig): Promise<StreamEndpoints> {
    try {
      // Step 1: Create input security group
      const securityGroup = await this.createInputSecurityGroup(streamId);

      // Step 2: Create input
      const input = await this.createInput(streamId, config.inputType, securityGroup.Id!);

      // Step 3: Create channel with encoding settings
      const channel = await this.createMediaLiveChannel(streamId, config, input.Id!);

      // Store references
      this.activeChannels.set(streamId, channel);
      this.activeInputs.set(streamId, input);

      // Return stream endpoints
      return {
        rtmpUrl: input.Destinations?.[0]?.Url || '',
        streamKey: streamId,
        playbackUrl: this.generatePlaybackUrl(config.s3BucketName, config.s3Prefix, streamId)
      };
    } catch (error) {
      console.error('Failed to create MediaLive channel:', error);
      throw error;
    }
  }

  /**
   * Create input security group
   */
  private async createInputSecurityGroup(streamId: string): Promise<InputSecurityGroup> {
    const command = new CreateInputSecurityGroupCommand({
      WhitelistRules: [
        {
          Cidr: '0.0.0.0/0' // Allow from anywhere - restrict in production
        }
      ],
      Tags: {
        StreamId: streamId
      }
    });

    const response = await this.client.send(command);
    return response.SecurityGroup!;
  }

  /**
   * Create MediaLive input
   */
  private async createInput(
    streamId: string,
    inputType: string,
    securityGroupId: string
  ): Promise<Input> {
    const command = new CreateInputCommand({
      Name: `ann-pale-input-${streamId}`,
      Type: inputType as any,
      InputSecurityGroups: [securityGroupId],
      Destinations: inputType === 'RTMP_PUSH' ? [
        {
          StreamName: `live/${streamId}`
        }
      ] : undefined,
      Tags: {
        StreamId: streamId
      }
    });

    const response = await this.client.send(command);
    return response.Input!;
  }

  /**
   * Create MediaLive channel with encoding settings
   */
  private async createMediaLiveChannel(
    streamId: string,
    config: ChannelConfig,
    inputId: string
  ): Promise<Channel> {
    const encoderSettings = this.getEncoderSettings(config.encodingProfile);
    const outputDestinations = this.getOutputDestinations(config.s3BucketName, config.s3Prefix, streamId);

    const command = new CreateChannelCommand({
      Name: `ann-pale-channel-${streamId}`,
      RoleArn: process.env.MEDIALIVE_ROLE_ARN, // IAM role for MediaLive
      InputAttachments: [{
        InputId: inputId,
        InputAttachmentName: 'primary-input',
        InputSettings: {
          SourceEndBehavior: 'CONTINUE',
          InputFilter: 'AUTO',
          FilterStrength: 1,
          DeblockFilter: 'DISABLED',
          DenoiseFilter: 'DISABLED',
          AudioSelectors: [],
          CaptionSelectors: []
        }
      }],
      EncoderSettings: encoderSettings,
      Destinations: outputDestinations,
      ChannelClass: 'SINGLE_PIPELINE', // Use STANDARD for redundancy
      Tags: {
        StreamId: streamId
      }
    });

    const response = await this.client.send(command);
    return response.Channel!;
  }

  /**
   * Get encoder settings based on profile
   */
  private getEncoderSettings(profile: string): EncoderSettings {
    const videoSettings = this.getVideoSettings(profile);
    const audioSettings = this.getAudioSettings();

    return {
      VideoDescriptions: videoSettings,
      AudioDescriptions: audioSettings,
      OutputGroups: [{
        Name: 'hls-group',
        OutputGroupSettings: {
          HlsGroupSettings: {
            Destination: {
              DestinationRefId: 's3-destination'
            },
            SegmentLength: 4,
            MinSegmentLength: 1,
            ManifestCompression: 'NONE',
            DirectoryStructure: 'SINGLE_DIRECTORY',
            ManifestDurationFormat: 'FLOATING_POINT',
            StreamInfResolution: 'INCLUDE',
            ClientCache: 'ENABLED',
            CaptionLanguageSetting: 'OMIT',
            CaptionLanguageMappings: [],
            ProgramDateTime: 'EXCLUDE',
            TimestampDeltaMilliseconds: 0,
            SegmentationMode: 'USE_SEGMENT_DURATION'
          }
        },
        Outputs: this.getOutputs(profile)
      }],
      TimecodeConfig: {
        Source: 'SYSTEMCLOCK'
      },
      GlobalConfiguration: {
        InitialAudioGain: 0,
        InputEndAction: 'NONE',
        OutputLockingMode: 'PIPELINE_LOCKING',
        OutputTimingSource: 'INPUT_CLOCK',
        SupportLowFramerateInputs: 'DISABLED'
      }
    } as EncoderSettings;
  }

  /**
   * Get video encoding settings
   */
  private getVideoSettings(profile: string): VideoDescription[] {
    const profiles: Record<string, VideoDescription> = {
      'HD-720p': {
        Name: 'video-720p',
        Width: 1280,
        Height: 720,
        CodecSettings: {
          H264Settings: {
            Bitrate: 2500000,
            RateControlMode: 'QVBR',
            QvbrSettings: {
              QualityLevel: 7
            },
            FramerateControl: 'SPECIFIED',
            FramerateNumerator: 30,
            FramerateDenominator: 1,
            GopSize: 2,
            GopSizeUnits: 'SECONDS',
            Profile: 'HIGH',
            Level: 'H264_LEVEL_AUTO',
            AdaptiveQuantization: 'HIGH',
            SpatialAq: 'ENABLED',
            TemporalAq: 'ENABLED',
            FlickerAq: 'ENABLED'
          }
        },
        RespondToAfd: 'NONE',
        ScalingBehavior: 'DEFAULT',
        Sharpness: 50
      } as VideoDescription,
      'SD-540p': {
        Name: 'video-540p',
        Width: 960,
        Height: 540,
        CodecSettings: {
          H264Settings: {
            Bitrate: 1500000,
            RateControlMode: 'QVBR',
            QvbrSettings: {
              QualityLevel: 6
            },
            FramerateControl: 'SPECIFIED',
            FramerateNumerator: 30,
            FramerateDenominator: 1,
            GopSize: 2,
            GopSizeUnits: 'SECONDS',
            Profile: 'MAIN',
            Level: 'H264_LEVEL_AUTO',
            AdaptiveQuantization: 'HIGH'
          }
        },
        RespondToAfd: 'NONE',
        ScalingBehavior: 'DEFAULT',
        Sharpness: 50
      } as VideoDescription,
      'SD-360p': {
        Name: 'video-360p',
        Width: 640,
        Height: 360,
        CodecSettings: {
          H264Settings: {
            Bitrate: 800000,
            RateControlMode: 'QVBR',
            QvbrSettings: {
              QualityLevel: 5
            },
            FramerateControl: 'SPECIFIED',
            FramerateNumerator: 30,
            FramerateDenominator: 1,
            GopSize: 2,
            GopSizeUnits: 'SECONDS',
            Profile: 'MAIN',
            Level: 'H264_LEVEL_AUTO',
            AdaptiveQuantization: 'MEDIUM'
          }
        },
        RespondToAfd: 'NONE',
        ScalingBehavior: 'DEFAULT',
        Sharpness: 50
      } as VideoDescription
    };

    return [profiles[profile] || profiles['HD-720p']];
  }

  /**
   * Get audio encoding settings
   */
  private getAudioSettings(): AudioDescription[] {
    return [{
      Name: 'audio-aac',
      AudioSelectorName: 'default',
      CodecSettings: {
        AacSettings: {
          Bitrate: 128000,
          CodingMode: 'CODING_MODE_2_0',
          SampleRate: 48000,
          Profile: 'LC',
          RateControlMode: 'CBR'
        }
      },
      AudioTypeControl: 'FOLLOW_INPUT',
      LanguageCodeControl: 'FOLLOW_INPUT'
    }] as AudioDescription[];
  }

  /**
   * Get output configurations
   */
  private getOutputs(profile: string): any[] {
    return [{
      Name: `output-${profile}`,
      VideoDescriptionName: `video-${profile.toLowerCase().replace('-', '')}`,
      AudioDescriptionNames: ['audio-aac'],
      OutputSettings: {
        HlsOutputSettings: {
          NameModifier: '_stream',
          HlsSettings: {
            StandardHlsSettings: {
              M3u8Settings: {
                AudioFramesPerPes: 2,
                AudioPids: '492-498',
                PcrControl: 'PCR_EVERY_PES_PACKET',
                PmtPid: '480',
                ProgramNum: 1,
                VideoPid: '481'
              }
            }
          }
        }
      }
    }];
  }

  /**
   * Get S3 output destinations
   */
  private getOutputDestinations(bucket: string, prefix: string, streamId: string): OutputDestination[] {
    return [{
      Id: 's3-destination',
      Settings: [{
        Url: `s3://${bucket}/${prefix}/${streamId}`
      }]
    }];
  }

  /**
   * Start a MediaLive channel
   */
  async startChannel(streamId: string): Promise<void> {
    const channel = this.activeChannels.get(streamId);
    if (!channel) {
      throw new Error(`Channel not found for stream ${streamId}`);
    }

    const command = new StartChannelCommand({
      ChannelId: channel.Id!
    });

    await this.client.send(command);
  }

  /**
   * Stop a MediaLive channel
   */
  async stopChannel(streamId: string): Promise<void> {
    const channel = this.activeChannels.get(streamId);
    if (!channel) {
      throw new Error(`Channel not found for stream ${streamId}`);
    }

    const command = new StopChannelCommand({
      ChannelId: channel.Id!
    });

    await this.client.send(command);
  }

  /**
   * Delete a MediaLive channel and its resources
   */
  async deleteChannel(streamId: string): Promise<void> {
    try {
      // Stop channel first if running
      await this.stopChannel(streamId);

      // Wait for channel to stop
      await this.waitForChannelState(streamId, 'IDLE');

      // Delete channel
      const channel = this.activeChannels.get(streamId);
      if (channel) {
        const deleteChannelCommand = new DeleteChannelCommand({
          ChannelId: channel.Id!
        });
        await this.client.send(deleteChannelCommand);
        this.activeChannels.delete(streamId);
      }

      // Delete input
      const input = this.activeInputs.get(streamId);
      if (input) {
        const deleteInputCommand = new DeleteInputCommand({
          InputId: input.Id!
        });
        await this.client.send(deleteInputCommand);
        this.activeInputs.delete(streamId);
      }
    } catch (error) {
      console.error('Failed to delete MediaLive resources:', error);
      throw error;
    }
  }

  /**
   * Wait for channel to reach desired state
   */
  private async waitForChannelState(streamId: string, targetState: ChannelState): Promise<void> {
    const channel = this.activeChannels.get(streamId);
    if (!channel) return;

    const maxAttempts = 30;
    const delayMs = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      const command = new DescribeChannelCommand({
        ChannelId: channel.Id!
      });

      const response = await this.client.send(command);
      if (response.State === targetState) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error(`Channel ${streamId} did not reach ${targetState} state in time`);
  }

  /**
   * Generate HLS playback URL
   */
  private generatePlaybackUrl(bucket: string, prefix: string, streamId: string): string {
    // This would typically be a CloudFront URL
    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN || `${bucket}.s3.amazonaws.com`;
    return `https://${cloudfrontDomain}/${prefix}/${streamId}/master.m3u8`;
  }

  /**
   * Get channel status
   */
  async getChannelStatus(streamId: string): Promise<ChannelState | null> {
    const channel = this.activeChannels.get(streamId);
    if (!channel) return null;

    const command = new DescribeChannelCommand({
      ChannelId: channel.Id!
    });

    const response = await this.client.send(command);
    return response.State || null;
  }
}

// Singleton instance
let managerInstance: MediaLiveManager | null = null;

export function getMediaLiveManager(): MediaLiveManager {
  if (!managerInstance) {
    managerInstance = new MediaLiveManager({
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }
  return managerInstance;
}