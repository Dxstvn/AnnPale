// AWS Configuration
// This file manages AWS service configurations securely

import { IvsClient } from '@aws-sdk/client-ivs'
import { MediaTailorClient } from '@aws-sdk/client-mediatailor'
import { S3Client } from '@aws-sdk/client-s3'
import { CloudFrontClient } from '@aws-sdk/client-cloudfront'

// Validate environment variables
const validateEnvVars = () => {
  const required = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_ACCOUNT_ID'
  ]
  
  const missing = required.filter(key => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Only validate in server-side code
if (typeof window === 'undefined') {
  validateEnvVars()
}

// AWS Configuration (server-side only)
export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
}

// AWS Account Configuration
export const awsAccountConfig = {
  accountId: process.env.AWS_ACCOUNT_ID!,
  region: process.env.AWS_REGION || 'us-east-1',
  streamingBucket: `annpale-streams-${process.env.AWS_ACCOUNT_ID}`,
  recordingBucket: `annpale-recordings-${process.env.AWS_ACCOUNT_ID}`,
  adsBucket: `annpale-ads-${process.env.AWS_ACCOUNT_ID}`,
}

// Initialize AWS Clients (server-side only)
export const createAWSClients = () => {
  if (typeof window !== 'undefined') {
    throw new Error('AWS clients can only be created on the server side')
  }

  return {
    ivs: new IvsClient(awsConfig),
    mediaTailor: new MediaTailorClient(awsConfig),
    s3: new S3Client(awsConfig),
    cloudFront: new CloudFrontClient(awsConfig),
  }
}

// Resource naming conventions
export const getResourceName = (resourceType: string, identifier: string) => {
  const prefix = 'annpale'
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  return `${prefix}-${env}-${resourceType}-${identifier}`
}

// IVS Channel Configuration
export const ivsConfig = {
  channelType: 'STANDARD' as const, // STANDARD or BASIC
  latencyMode: 'LOW' as const,      // LOW or NORMAL
  recordingEnabled: true,
  thumbnailEnabled: true,
}

// MediaTailor Configuration
export const mediaTailorConfig = {
  adDecisionServerUrl: process.env.AD_DECISION_SERVER_URL || 'https://example.com/ads',
  slateAdUrl: process.env.SLATE_AD_URL || 'https://example.com/slate.mp4',
  personalizationThreshold: 2,
  maxDurationSeconds: 30,
}

// CloudFront Configuration
export const cloudFrontConfig = {
  priceClass: 'PriceClass_100', // Use only North America and Europe
  enabled: true,
  isIPV6Enabled: true,
  httpVersion: 'http2',
}

// Export types for use in other files
export type AWSClients = ReturnType<typeof createAWSClients>