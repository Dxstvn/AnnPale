import { NextRequest, NextResponse } from 'next/server'
import type { GeolocationData } from '@/types/video'

export async function GET(request: NextRequest) {
  try {
    // Get geolocation from Vercel headers (when deployed on Vercel)
    const country = request.headers.get('x-vercel-ip-country') || request.geo?.country
    const countryCode = request.headers.get('x-vercel-ip-country-code') || request.geo?.country
    const region = request.headers.get('x-vercel-ip-region') || request.geo?.region
    const city = request.headers.get('x-vercel-ip-city') || request.geo?.city
    
    // Get latitude/longitude if available
    const latitude = request.geo?.latitude
    const longitude = request.geo?.longitude
    
    // Fallback: Try to get IP and use external service
    let geoData: GeolocationData = {
      country: country || undefined,
      country_code: countryCode || undefined,
      region: region || undefined,
      city: city || undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    }
    
    // If no geo data from Vercel, try IP-based detection
    if (!country && !countryCode) {
      // Get client IP
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : 
                 request.headers.get('x-real-ip') ||
                 request.ip ||
                 '127.0.0.1'
      
      // Don't call external service for localhost
      if (ip !== '127.0.0.1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
        try {
          // Use ip-api.com (free tier, no API key required)
          const ipResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone,currency`)
          
          if (ipResponse.ok) {
            const ipData = await ipResponse.json()
            
            if (ipData.status === 'success') {
              geoData = {
                country: ipData.country,
                country_code: ipData.countryCode,
                region: ipData.regionName,
                city: ipData.city,
                latitude: ipData.lat,
                longitude: ipData.lon,
                timezone: ipData.timezone,
                currency: ipData.currency as any,
              }
            }
          }
        } catch (error) {
          console.error('IP geolocation error:', error)
        }
      }
    }
    
    // Determine if user is in Haiti
    geoData.is_haiti = geoData.country_code === 'HT' || 
                       geoData.country?.toLowerCase() === 'haiti'
    
    // Set appropriate currency based on location
    if (geoData.is_haiti) {
      geoData.currency = 'HTG'
    } else if (!geoData.currency) {
      // Default to USD for non-Haiti locations
      geoData.currency = 'USD'
    }
    
    // Return geolocation data
    return NextResponse.json(geoData)
    
  } catch (error: any) {
    console.error('Geolocation detection error:', error)
    
    // Return empty data on error (client will show all payment options)
    return NextResponse.json({
      error: 'Failed to detect location',
      is_haiti: false,
      currency: 'USD'
    }, { status: 200 }) // Return 200 to not break the flow
  }
}

// Also support POST for more advanced detection with client hints
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Client can send additional hints
    const { timezone, language, currency } = body
    
    // Get server-side detection first
    const serverGeo = await GET(request)
    const serverData = await serverGeo.json()
    
    // Enhance with client hints
    const enhancedData: GeolocationData = {
      ...serverData,
      timezone: timezone || serverData.timezone,
    }
    
    // Additional Haiti detection based on client hints
    if (!enhancedData.is_haiti) {
      // Check if timezone indicates Haiti
      if (timezone === 'America/Port-au-Prince') {
        enhancedData.is_haiti = true
        enhancedData.currency = 'HTG'
      }
      
      // Check if language preference indicates Haiti
      if (language === 'ht' || language === 'fr-HT') {
        enhancedData.is_haiti = true
        enhancedData.currency = 'HTG'
      }
    }
    
    return NextResponse.json(enhancedData)
    
  } catch (error: any) {
    console.error('Enhanced geolocation error:', error)
    return NextResponse.json({
      error: 'Failed to process location data',
      is_haiti: false,
      currency: 'USD'
    }, { status: 200 })
  }
}