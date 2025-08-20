/**
 * Script to automatically generate translation files using LibreTranslate
 * Run with: node scripts/generate-translations.js
 */

const fs = require('fs');
const path = require('path');

// LibreTranslate API function
async function translateText(text, from = 'en', to) {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.warn(`Translation failed for "${text}" (${from} -> ${to}):`, error);
    return text; // Fallback to original text
  }
}

// Translate object recursively
async function translateObject(obj, from = 'en', to) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      console.log(`Translating: "${value}" to ${to}`);
      translated[key] = await translateText(value, from, to);
      // Add small delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, from, to);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function generateTranslations() {
  try {
    // Read the English source file
    const enPath = path.join(__dirname, '../i18n/messages/en.json');
    const enMessages = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // Generate French translations
    console.log('Generating French translations...');
    const frMessages = await translateObject(enMessages, 'en', 'fr');
    const frPath = path.join(__dirname, '../i18n/messages/fr.json');
    fs.writeFileSync(frPath, JSON.stringify(frMessages, null, 2));
    console.log('✅ French translations saved to', frPath);

    // Generate Haitian Creole translations
    console.log('Generating Haitian Creole translations...');
    const htMessages = await translateObject(enMessages, 'en', 'ht');
    const htPath = path.join(__dirname, '../i18n/messages/ht.json');
    fs.writeFileSync(htPath, JSON.stringify(htMessages, null, 2));
    console.log('✅ Haitian Creole translations saved to', htPath);

    console.log('🎉 All translations generated successfully!');
  } catch (error) {
    console.error('❌ Error generating translations:', error);
    process.exit(1);
  }
}

// Run the script
generateTranslations();