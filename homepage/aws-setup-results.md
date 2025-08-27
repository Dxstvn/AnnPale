# AWS Infrastructure Setup Results

## ✅ Setup Completed Successfully!

### S3 Buckets Created:
1. **Streams Bucket**: `annpale-streams-206254861786`
2. **Recordings Bucket**: `annpale-recordings-206254861786`
3. **Ads Bucket**: `annpale-ads-206254861786`

### IVS Channel Created:

#### Channel Details:
- **Channel Name**: annpale-test-channel
- **Channel ARN**: `arn:aws:ivs:us-east-1:206254861786:channel/ALKd3nFpmt5Z`
- **Type**: STANDARD
- **Latency Mode**: LOW

#### Streaming Endpoints:
- **Playback URL** (for viewers): 
  ```
  https://eb5fc6c5eb1d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.206254861786.channel.ALKd3nFpmt5Z.m3u8
  ```
  
- **Ingest Endpoint** (for streaming software):
  ```
  rtmps://eb5fc6c5eb1d.global-contribute.live-video.net:443/app/
  ```

#### Stream Key (KEEP THIS SECRET!):
```
REDACTED
```

## OBS Studio Configuration:

1. Open OBS Studio
2. Go to Settings → Stream
3. Configure as follows:
   - **Service**: Custom
   - **Server**: `rtmps://eb5fc6c5eb1d.global-contribute.live-video.net:443/app/`
   - **Stream Key**: `REDACTED`

## Testing Your Stream:

1. **Start streaming from OBS**
2. **View your stream at**: Open the playback URL in a video player or browser
3. **Test with HLS.js**: You can test the stream using an HLS player

## Security Notes:

⚠️ **IMPORTANT**: 
- Never expose the stream key in client-side code
- Store it securely in your database
- Only provide it to authorized creators
- Rotate stream keys regularly

## Next Steps:

1. **Save these credentials** in your Supabase database
2. **Update the live_streams table** with the channel ARN and playback URL
3. **Create API endpoints** to manage streams securely
4. **Implement stream key management** for creators

## Cost Estimates:

- **Channel Cost**: $2.00/hour (STANDARD channel when live)
- **Viewer Cost**: 
  - First 10,000 viewer hours: $0.15/hour
  - Next 40,000 viewer hours: $0.10/hour
  - Beyond 50,000: $0.05/hour

## Clean Up (When needed):

To delete resources and stop charges:
```bash
# Delete IVS Channel
aws ivs delete-channel --arn arn:aws:ivs:us-east-1:206254861786:channel/ALKd3nFpmt5Z

# Delete S3 Buckets (must be empty first)
aws s3 rm s3://annpale-streams-206254861786 --recursive
aws s3api delete-bucket --bucket annpale-streams-206254861786
```