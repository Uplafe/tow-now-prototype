'use client'
import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { DEFAULT_CENTER } from '@/lib/mockData'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoidXBsYWZlIiwiYSI6ImNtbXJ2cnZvODFjN2gycXNkNWdoZjV3OGsifQ.5Eb_dTwzOWZDz1vz5zWceg'

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  pickup?: [number, number] | null
  dropoff?: [number, number] | null
  driverPos?: [number, number] | null
  nearbyDrivers?: [number, number][]
  onMapClick?: (coords: [number, number]) => void
  className?: string
}

export default function MapView({
  center = DEFAULT_CENTER,
  zoom = 13,
  pickup,
  dropoff,
  driverPos,
  nearbyDrivers = [],
  onMapClick,
  className = '',
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const pickupMarker = useRef<mapboxgl.Marker | null>(null)
  const dropoffMarker = useRef<mapboxgl.Marker | null>(null)
  const driverMarker = useRef<mapboxgl.Marker | null>(null)
  const nearbyMarkers = useRef<mapboxgl.Marker[]>([])

  const makeEl = useCallback((emoji: string, size = 36) => {
    const el = document.createElement('div')
    el.style.cssText = `width:${size}px;height:${size}px;font-size:${size * 0.7}px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5));cursor:pointer;`
    el.textContent = emoji
    return el
  }, [])

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center,
      zoom,
      attributionControl: false,
    })
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick([e.lngLat.lng, e.lngLat.lat])
      })
    }
    return () => { map.current?.remove(); map.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pickup marker
  useEffect(() => {
    if (!map.current) return
    pickupMarker.current?.remove()
    if (pickup) {
      pickupMarker.current = new mapboxgl.Marker({ element: makeEl('📍', 40) })
        .setLngLat(pickup)
        .setPopup(new mapboxgl.Popup({ offset: 20 }).setText('Pickup location'))
        .addTo(map.current)
      map.current.easeTo({ center: pickup, zoom: 14, duration: 600 })
    }
  }, [pickup, makeEl])

  // Dropoff marker
  useEffect(() => {
    if (!map.current) return
    dropoffMarker.current?.remove()
    if (dropoff) {
      dropoffMarker.current = new mapboxgl.Marker({ element: makeEl('🏁', 40) })
        .setLngLat(dropoff)
        .setPopup(new mapboxgl.Popup({ offset: 20 }).setText('Drop-off location'))
        .addTo(map.current)
    }
    // Fit both in view
    if (pickup && dropoff) {
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend(pickup)
      bounds.extend(dropoff)
      map.current.fitBounds(bounds, { padding: 80, duration: 800 })
    }
  }, [dropoff, pickup, makeEl])

  // Driver marker (live tracking)
  useEffect(() => {
    if (!map.current) return
    if (driverPos) {
      if (!driverMarker.current) {
        driverMarker.current = new mapboxgl.Marker({ element: makeEl('🚛', 44) })
          .setLngLat(driverPos)
          .addTo(map.current)
      } else {
        driverMarker.current.setLngLat(driverPos)
      }
    } else {
      driverMarker.current?.remove()
      driverMarker.current = null
    }
  }, [driverPos, makeEl])

  // Nearby drivers (idle state)
  useEffect(() => {
    if (!map.current) return
    nearbyMarkers.current.forEach(m => m.remove())
    nearbyMarkers.current = nearbyDrivers.map(pos =>
      new mapboxgl.Marker({ element: makeEl('🚛', 32) })
        .setLngLat(pos)
        .addTo(map.current!)
    )
  }, [nearbyDrivers, makeEl])

  // Route line between pickup and dropoff
  useEffect(() => {
    const m = map.current
    if (!m || !pickup || !dropoff) return
    const sourceId = 'route'
    const layerId  = 'route-line'
    const addRoute = () => {
      if (m.getSource(sourceId)) m.removeLayer(layerId), m.removeSource(sourceId)
      m.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [pickup, dropoff] } },
      })
      m.addLayer({
        id: layerId, type: 'line', source: sourceId,
        paint: { 'line-color': '#3b82f6', 'line-width': 3, 'line-dasharray': [2, 2], 'line-opacity': 0.7 },
      })
    }
    if (m.isStyleLoaded()) addRoute()
    else m.once('load', addRoute)
    return () => {
      if (m.getLayer(layerId)) m.removeLayer(layerId)
      if (m.getSource(sourceId)) m.removeSource(sourceId)
    }
  }, [pickup, dropoff])

  return <div ref={mapContainer} className={`w-full h-full ${className}`} />
}
