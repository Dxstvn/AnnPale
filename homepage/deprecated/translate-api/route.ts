import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, to, from = 'en' } = await request.json();

    if (!text || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: text and to' },
        { status: 400 }
      );
    }

    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.AZURE_TRANSLATOR_KEY;
    const region = process.env.AZURE_TRANSLATOR_REGION || 'global';

    if (!endpoint || !key) {
      return NextResponse.json(
        { error: 'Azure Translator credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${endpoint}/translate?api-version=3.0&to=${to}&from=${from}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ text }])
    });

    if (!response.ok) {
      throw new Error(`Azure Translator API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].translations && data[0].translations[0]) {
      return NextResponse.json({
        translatedText: data[0].translations[0].text,
        detectedLanguage: data[0].detectedLanguage?.language,
        from,
        to
      });
    }
    
    throw new Error('Invalid response format from Azure Translator');
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}