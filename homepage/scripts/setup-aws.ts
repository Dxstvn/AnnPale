#!/usr/bin/env node

// AWS Infrastructure Setup Script
// Run this to initialize all AWS services for streaming

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

import { setupS3Buckets } from '../lib/aws/s3'
import { createIVSChannel } from '../lib/aws/ivs'

async function setupAWSInfrastructure() {
  console.log('🚀 Starting AWS Infrastructure Setup...\n')
  
  try {
    // Step 1: Create S3 buckets
    console.log('📦 Setting up S3 buckets...')
    const bucketResult = await setupS3Buckets()
    console.log('✅ S3 buckets ready:', bucketResult.buckets)
    console.log('')

    // Step 2: Create a test IVS channel (optional)
    console.log('📺 Creating test IVS channel...')
    const testChannel = await createIVSChannel('test-creator', 'Test Channel')
    console.log('✅ Test IVS channel created:')
    console.log('   - Channel ARN:', testChannel.channel.arn)
    console.log('   - Playback URL:', testChannel.channel.playbackUrl)
    console.log('   - Ingest Endpoint:', testChannel.channel.ingestEndpoint)
    console.log('   - Stream Key:', testChannel.streamKey.value)
    console.log('')
    
    console.log('🎉 AWS Infrastructure setup complete!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Save the test channel details in your database')
    console.log('2. Configure OBS Studio with the ingest endpoint and stream key')
    console.log('3. Update your .env.local with any additional configuration')
    console.log('')
    console.log('⚠️  Important Security Notes:')
    console.log('- Never expose stream keys in client-side code')
    console.log('- Rotate stream keys regularly')
    console.log('- Monitor AWS costs in the AWS Console')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setupAWSInfrastructure().catch(console.error)