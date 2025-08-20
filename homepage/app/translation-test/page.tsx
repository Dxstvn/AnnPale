"use client"

import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"

export default function TranslationTestPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Static Translation Test</h1>
        
        {/* Language Switcher */}
        <div className="mb-8 flex gap-4">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            English 🇺🇸
          </button>
          <button 
            onClick={() => setLanguage('fr')}
            className={`px-4 py-2 rounded ${language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Français 🇫🇷
          </button>
          <button 
            onClick={() => setLanguage('ht')}
            className={`px-4 py-2 rounded ${language === 'ht' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Kreyòl 🇭🇹
          </button>
        </div>

        {/* Test Static Translation */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Static Translation Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title:</label>
                <div className="text-lg">
                  {getTranslation('home.hero.title', language)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle:</label>
                <div className="text-base text-gray-600">
                  {getTranslation('home.hero.subtitle', language)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Button Text:</label>
                <button className="bg-purple-600 text-white px-4 py-2 rounded">
                  {getTranslation('homepage.buttons.browse_creators', language)}
                </button>
              </div>
            </div>
          </div>

          {/* Test useTranslatedText Hook */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Hook Translation Test</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Search Input Placeholder:</label>
              <input 
                type="text" 
                placeholder={getTranslation('home.hero.searchPlaceholder', language)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Current Language Display */}
          <div className="bg-blue-50 p-4 rounded">
            <p>Current Language: <strong>{language}</strong></p>
            <p className="text-sm text-gray-600">Switch languages using the buttons above to see static translation</p>
          </div>
        </div>
      </div>
    </div>
  )
}