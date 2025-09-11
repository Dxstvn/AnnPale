const fs = require('fs')
const path = require('path')

// Load .env.local file
const envPath = path.resolve(process.cwd(), '.env.local')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Parse and set environment variables
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) return
    
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '') // Remove quotes
      process.env[key.trim()] = value.trim()
    }
  })
  
  console.log('✅ Environment variables loaded from .env.local')
} else {
  console.error('❌ .env.local file not found')
  process.exit(1)
}