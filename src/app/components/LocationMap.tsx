'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Loader2 } from 'lucide-react'


interface LocationMapProps {
  latitude: number
  longitude: number
}

export default function LocationMap({ latitude, longitude }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    const initMap = async () => {
      try {
        console.log('Starting map initialization...');
        setIsLoading(true)
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key is missing');
        }
        console.log('API Key found, loading Google Maps...');
        
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places', 'marker'],
        })

        await loader.load()
        console.log('Google Maps loaded successfully');

        // Ensure the div is still available after loading
        if (!mapRef.current) {
          throw new Error('Map container not found')
        }

        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary

        const mapOptions: google.maps.MapOptions = {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }

        const map = new Map(mapRef.current, mapOptions)

        new AdvancedMarkerElement({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: 'Kampus Pemuda'
        })

        setMapLoaded(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setMapError('Terjadi kesalahan saat memuat peta. Pastikan API key sudah dikonfigurasi dengan benar.')
        setIsLoading(false)
      }
    }

    initMap()
  }, [latitude, longitude, mapLoaded])

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Memuat peta...</span>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center px-4">
          <p className="text-red-600 mb-2">{mapError}</p>
          <p className="text-sm text-gray-600">
            Alamat: Jl. Pemuda No.10, RT.2/RW.7, Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96 rounded-lg shadow-md overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  )
}
