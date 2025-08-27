#!/usr/bin/env node

// AWS Infrastructure Setup Script
// Run this to initialize all AWS services for streaming

const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Set up environment for AWS SDK
process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
process.env.AWS_REGION = process.env.AWS_REGION

const { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3')
const { IVSClient, CreateChannelCommand } = require('@aws-sdk/client-ivs')

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}

const awsAccountConfig = {
  accountId: process.env.AWS_ACCOUNT_ID,
  region: process.env.AWS_REGION || 'us-east-1',
  streamingBucket: `annpale-streams-${process.env.AWS_ACCOUNT_ID}`,
  recordingBucket: `annpale-recordings-${process.env.AWS_ACCOUNT_ID}`,
  adsBucket: `annpale-ads-${process.env.AWS_ACCOUNT_ID}`,
}

// Create S3 client
const s3Client = new S3Client(awsConfig)
const ivsClient = new IVSClient(awsConfig)

async function setupS3Buckets() {
  const buckets = [
    awsAccountConfig.streamingBucket,
    awsAccountConfig.recordingBucket,
    awsAccountConfig.adsBucket,
  ]

  for (const bucketName of buckets) {
    try {
      // Check if bucket exists
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
      console.log(`✓ Bucket ${bucketName} already exists`)
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        // Create bucket
        try {
          const createCommand = new CreateBucketCommand({ 
            Bucket: bucketName,
            // Only specify LocationConstraint if not us-east-1
            ...(awsAccountConfig.region !== 'us-east-1' && {
              CreateBucketConfiguration: {
                LocationConstraint: awsAccountConfig.region,
              },
            }),
          })
          
          await s3Client.send(createCommand)
          console.log(`✅ Created bucket: ${bucketName}`)
          
          // Set up CORS
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
          
          await s3Client.send(new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: corsConfiguration,
          }))
          console.log(`   - CORS configured for ${bucketName}`)
          
        } catch (createError) {
          console.error(`❌ Error creating bucket ${bucketName}:`, createError.message)
          throw createError
        }
      } else {
        console.error(`❌ Error checking bucket ${bucketName}:`, error.message)
      }
    }
  }
  
  return { success: true, buckets }
}

async function createTestIVSChannel() {
  try {
    const command = new CreateChannelCommand({
      name: `annpale-dev-channel-test-${Date.now()}`,
      type: 'STANDARD',
      latencyMode: 'LOW',
      tags: {
        creatorId: 'test-creator',
        environment: 'development',
        createdAt: new Date().toISOString(),
      },
    })

    const response = await ivsClient.send(command)
    
    if (!response.channel || !response.streamKey) {
      throw new Error('Failed to create IVS channel')
    }

    return {
      channel: response.channel,
      streamKey: response.streamKey,
    }
  } catch (error) {
    console.error('Error creating IVS channel:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting AWS Infrastructure Setup...')
  console.log('   Region:', awsAccountConfig.region)
  console.log('   Account ID:', awsAccountConfig.accountId)
  console.log('')
  
  try {
    // Step 1: Create S3 buckets
    console.log('📦 Setting up S3 buckets...')
    const bucketResult = await setupS3Buckets()
    console.log('')

    // Step 2: Create a test IVS channel
    console.log('📺 Creating test IVS channel...')
    const testChannel = await createTestIVSChannel()
    console.log('✅ Test IVS channel created:')
    console.log('   - Channel ARN:', testChannel.channel.arn)
    console.log('   - Playback URL:', testChannel.channel.playbackUrl)
    console.log('   - Ingest Endpoint:', testChannel.channel.ingestEndpoint)
    console.log('   - Stream Key (KEEP SECRET!):', testChannel.streamKey.value)
    console.log('')
    
    console.log('🎉 AWS Infrastructure setup complete!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Save the channel details in your database')
    console.log('2. Configure OBS Studio with:')
    console.log('   - Server: rtmps://' + testChannel.channel.ingestEndpoint + ':443/app/')
    console.log('   - Stream Key: ' + testChannel.streamKey.value)
    console.log('3. Test streaming to the playback URL:')
    console.log('   ' + testChannel.channel.playbackUrl)
    console.log('')
    console.log('⚠️  Important Security Notes:')
    console.log('- Never expose stream keys in client-side code')
    console.log('- Store the stream key securely in your database')
    console.log('- Rotate stream keys regularly')
    console.log('- Monitor AWS costs in the AWS Console')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.error('   Make sure your AWS credentials are correctly set in .env.local')
    process.exit(1)
  }
}

// Run the setup
main().catch(console.error)