/**
 * Create Placeholder Images for Entertainment Icons
 * Generates placeholder profile and cover images for demo creators
 * Using simple colored rectangles with creator names
 */

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// Ensure directories exist
const profileDir = path.join(process.cwd(), 'public/images/creators/profiles/entertainment')
const coverDir = path.join(process.cwd(), 'public/images/creators/covers/entertainment')

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true })
}

if (!fs.existsSync(coverDir)) {
  fs.mkdirSync(coverDir, { recursive: true })
}

const creators = [
  {
    name: 'Ti Jo Zenny',
    filename: 'tijo-zenny',
    profileColor: '#9333EA', // Purple
    coverColor: '#7C3AED'    // Darker purple
  },
  {
    name: 'Richard Cavé',
    filename: 'richard-cave',
    profileColor: '#059669', // Green
    coverColor: '#047857'    // Darker green
  },
  {
    name: 'Carel Pedre',
    filename: 'carel-pedre',
    profileColor: '#DC2626', // Red
    coverColor: '#B91C1C'    // Darker red
  }
]

async function createPlaceholderImages() {
  console.log('🎨 Creating placeholder images for entertainment creators...')
  
  try {
    for (const creator of creators) {
      console.log(`   Creating images for: ${creator.name}`)
      
      // Create profile image (500x500)
      const profileSvg = `
        <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="500" fill="${creator.profileColor}"/>
          <text x="250" y="230" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
                text-anchor="middle" fill="white">${creator.name}</text>
          <text x="250" y="270" font-family="Arial, sans-serif" font-size="16" 
                text-anchor="middle" fill="white" opacity="0.8">Haitian Artist</text>
          <circle cx="250" cy="150" r="40" fill="white" opacity="0.2"/>
          <text x="250" y="160" font-family="Arial, sans-serif" font-size="30" 
                text-anchor="middle" fill="white">🎤</text>
        </svg>
      `
      
      await sharp(Buffer.from(profileSvg))
        .jpeg({ quality: 85 })
        .toFile(path.join(profileDir, `${creator.filename}.jpg`))
      
      console.log(`   ✅ Profile image: ${creator.filename}.jpg`)
      
      // Create cover image (1920x480)
      const coverSvg = `
        <svg width="1920" height="480" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:${creator.coverColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${creator.profileColor};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1920" height="480" fill="url(#gradient)"/>
          <text x="960" y="220" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
                text-anchor="middle" fill="white">${creator.name}</text>
          <text x="960" y="270" font-family="Arial, sans-serif" font-size="24" 
                text-anchor="middle" fill="white" opacity="0.9">Haitian Entertainment Icon</text>
          <text x="960" y="310" font-family="Arial, sans-serif" font-size="18" 
                text-anchor="middle" fill="white" opacity="0.7">Available for personalized video messages</text>
          <!-- Decorative elements -->
          <circle cx="200" cy="120" r="30" fill="white" opacity="0.1"/>
          <circle cx="1720" cy="360" r="35" fill="white" opacity="0.1"/>
          <circle cx="1600" cy="100" r="20" fill="white" opacity="0.15"/>
        </svg>
      `
      
      await sharp(Buffer.from(coverSvg))
        .jpeg({ quality: 85 })
        .toFile(path.join(coverDir, `${creator.filename}-banner.jpg`))
      
      console.log(`   ✅ Cover image: ${creator.filename}-banner.jpg`)
    }
    
    console.log('\n🎉 All placeholder images created successfully!')
    console.log('\n📁 Image locations:')
    console.log(`   Profiles: ${profileDir}`)
    console.log(`   Covers: ${coverDir}`)
    
  } catch (error) {
    console.error('❌ Error creating placeholder images:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  createPlaceholderImages()
}

module.exports = { createPlaceholderImages }