// AWS S3 Integration
// Handles storage for recordings, thumbnails, and VODs

import {
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createAWSClients, awsAccountConfig } from './config'

// Create S3 buckets for the platform
export async function setupS3Buckets() {
  const { s3 } = createAWSClients()
  
  const buckets = [
    awsAccountConfig.streamingBucket,
    awsAccountConfig.recordingBucket,
    awsAccountConfig.adsBucket,
  ]

  for (const bucketName of buckets) {
    try {
      // Check if bucket exists
      await s3.send(new HeadBucketCommand({ Bucket: bucketName }))
      console.log(`Bucket ${bucketName} already exists`)
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        // Create bucket
        try {
          await s3.send(new CreateBucketCommand({ 
            Bucket: bucketName,
            // Only specify LocationConstraint if not us-east-1
            ...(awsAccountConfig.region !== 'us-east-1' && {
              CreateBucketConfiguration: {
                LocationConstraint: awsAccountConfig.region as any,
              },
            }),
          }))
          console.log(`Created bucket: ${bucketName}`)
          
          // Set up CORS for browser uploads
          await setupBucketCORS(bucketName)
          
          // Set up bucket policy for CloudFront access (for streaming bucket)
          if (bucketName === awsAccountConfig.streamingBucket) {
            await setupBucketPolicy(bucketName)
          }
        } catch (createError) {
          console.error(`Error creating bucket ${bucketName}:`, createError)
          throw createError
        }
      } else {
        console.error(`Error checking bucket ${bucketName}:`, error)
      }
    }
  }
  
  return { success: true, buckets }
}

// Set up CORS configuration for a bucket
async function setupBucketCORS(bucketName: string) {
  const { s3 } = createAWSClients()
  
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: [
          'http://localhost:3000',
          'https://annpale.com',
          'https://*.annpale.com',
        ],
        ExposeHeaders: ['ETag', 'x-amz-server-side-encryption'],
        MaxAgeSeconds: 3000,
      },
    ],
  }

  try {
    await s3.send(new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    }))
    console.log(`CORS configured for bucket: ${bucketName}`)
  } catch (error) {
    console.error(`Error setting up CORS for ${bucketName}:`, error)
  }
}

// Set up bucket policy for public read access (via CloudFront)
async function setupBucketPolicy(bucketName: string) {
  const { s3 } = createAWSClients()
  
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowCloudFrontRead',
        Effect: 'Allow',
        Principal: {
          Service: 'cloudfront.amazonaws.com',
        },
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  }

  try {
    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    }))
    console.log(`Bucket policy configured for: ${bucketName}`)
  } catch (error) {
    console.error(`Error setting up bucket policy for ${bucketName}:`, error)
  }
}

// Upload a file to S3
export async function uploadToS3(
  bucketName: string,
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string,
  metadata?: Record<string, string>
) {
  const { s3 } = createAWSClients()
  
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
      ServerSideEncryption: 'AES256', // Enable encryption at rest
    })
    
    const response = await s3.send(command)
    return {
      success: true,
      etag: response.ETag,
      versionId: response.VersionId,
      location: `https://${bucketName}.s3.${awsAccountConfig.region}.amazonaws.com/${key}`,
    }
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error(`Failed to upload to S3: ${error}`)
  }
}

// Get a presigned URL for upload (for client-side uploads)
export async function getUploadPresignedUrl(
  bucketName: string,
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
) {
  const { s3 } = createAWSClients()
  
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    })
    
    const url = await getSignedUrl(s3, command, { expiresIn })
    return { url, expiresIn }
  } catch (error) {
    console.error('Error generating upload presigned URL:', error)
    throw new Error(`Failed to generate upload URL: ${error}`)
  }
}

// Get a presigned URL for download
export async function getDownloadPresignedUrl(
  bucketName: string,
  key: string,
  expiresIn: number = 3600 // 1 hour default
) {
  const { s3 } = createAWSClients()
  
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    
    const url = await getSignedUrl(s3, command, { expiresIn })
    return { url, expiresIn }
  } catch (error) {
    console.error('Error generating download presigned URL:', error)
    throw new Error(`Failed to generate download URL: ${error}`)
  }
}

// Delete a file from S3
export async function deleteFromS3(bucketName: string, key: string) {
  const { s3 } = createAWSClients()
  
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    
    await s3.send(command)
    return { success: true }
  } catch (error) {
    console.error('Error deleting from S3:', error)
    throw new Error(`Failed to delete from S3: ${error}`)
  }
}

// List objects in a bucket
export async function listS3Objects(
  bucketName: string,
  prefix?: string,
  maxKeys: number = 1000
) {
  const { s3 } = createAWSClients()
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys,
    })
    
    const response = await s3.send(command)
    return {
      objects: response.Contents || [],
      hasMore: response.IsTruncated || false,
      nextToken: response.NextContinuationToken,
    }
  } catch (error) {
    console.error('Error listing S3 objects:', error)
    throw new Error(`Failed to list S3 objects: ${error}`)
  }
}

// Helper: Generate S3 key for stream recordings
export function generateRecordingKey(
  creatorId: string,
  streamId: string,
  timestamp: Date = new Date()
) {
  const year = timestamp.getFullYear()
  const month = String(timestamp.getMonth() + 1).padStart(2, '0')
  const day = String(timestamp.getDate()).padStart(2, '0')
  
  return `recordings/${creatorId}/${year}/${month}/${day}/${streamId}/recording.mp4`
}

// Helper: Generate S3 key for stream thumbnails
export function generateThumbnailKey(
  creatorId: string,
  streamId: string,
  timestamp: Date = new Date()
) {
  const year = timestamp.getFullYear()
  const month = String(timestamp.getMonth() + 1).padStart(2, '0')
  
  return `thumbnails/${creatorId}/${year}/${month}/${streamId}-thumb.jpg`
}

// Helper: Calculate storage costs
export function estimateStorageCosts(
  storageGB: number,
  transferGB: number,
  requests: number,
  region: string = 'us-east-1'
) {
  // S3 Pricing (as of 2024)
  const pricing = {
    storage: {
      first50TB: 0.023,  // $0.023 per GB
      next450TB: 0.022,  // $0.022 per GB
    },
    transfer: {
      toInternet: 0.09,  // $0.09 per GB (after 1GB free)
      toCloudFront: 0,   // Free transfer to CloudFront
    },
    requests: {
      put: 0.005 / 1000,    // $0.005 per 1000 PUT requests
      get: 0.0004 / 1000,   // $0.0004 per 1000 GET requests
    },
  }

  const storageCost = storageGB * pricing.storage.first50TB
  const transferCost = Math.max(0, transferGB - 1) * pricing.transfer.toInternet // 1GB free
  const requestCost = requests * pricing.requests.get
  
  return {
    storageCost,
    transferCost,
    requestCost,
    totalCost: storageCost + transferCost + requestCost,
    breakdown: {
      storageGB,
      transferGB,
      requests,
      region,
    },
  }
}