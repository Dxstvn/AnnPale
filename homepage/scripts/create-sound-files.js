const fs = require('fs');
const path = require('path');

// Create a simple WAV file with a tone
function createWAVFile(frequency, duration, filename) {
  const sampleRate = 44100;
  const numSamples = sampleRate * duration;
  
  // WAV file header
  const header = Buffer.alloc(44);
  
  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4);
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // AudioFormat (PCM)
  header.writeUInt16LE(1, 22); // NumChannels (mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  header.writeUInt16LE(2, 32); // BlockAlign
  header.writeUInt16LE(16, 34); // BitsPerSample
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40);
  
  // Generate audio data
  const audioData = Buffer.alloc(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const value = Math.sin(2 * Math.PI * frequency * t) * 0.3 * 32767;
    audioData.writeInt16LE(Math.round(value), i * 2);
  }
  
  // Combine header and data
  const wavFile = Buffer.concat([header, audioData]);
  
  // Write to file
  fs.writeFileSync(filename, wavFile);
  console.log(`Created ${filename}`);
}

// Create notification sound (pleasant bell-like tone)
createWAVFile(880, 0.2, path.join(__dirname, '../public/sounds/notification.wav'));

// Create success sound (ascending tone)
createWAVFile(523.25, 0.15, path.join(__dirname, '../public/sounds/success.wav'));

// Create error sound (lower tone)
createWAVFile(220, 0.2, path.join(__dirname, '../public/sounds/error.wav'));

console.log('Sound files created successfully!');