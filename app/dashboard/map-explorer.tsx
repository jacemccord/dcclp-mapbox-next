"use client"

import { useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

interface LocationDetails {
  id: string
  name: string
  chief: string
  phoneNumber: string
  address: string
  coordinates: readonly [number, number]
}

// Define the exact coordinates for McLeod Lake
const MCLEOD_LAKE_LOCATION = {
  id: '1',
  name: 'McLeod Lake Indian Band',
  chief: 'Chief Harley Chingee',
  phoneNumber: '(250) 555-0123',
  address: '123 Example Street, McLeod Lake, BC V0J 2G0',
  coordinates: [-123.0890, 55.0379] // McLeod Lake coordinates
} as const;

const locations: LocationDetails[] = [
  MCLEOD_LAKE_LOCATION
  // Add more locations as needed
]

// Add this near the top of the file, after imports
type ViewStateType = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  transitionDuration: number;
}

export default function MapExplorer() {
  const [viewState, setViewState] = useState<ViewStateType>({
    longitude: MCLEOD_LAKE_LOCATION.coordinates[0],
    latitude: MCLEOD_LAKE_LOCATION.coordinates[1],
    zoom: 5,
    bearing: 0,
    pitch: 0,
    transitionDuration: 0
  })
  
  const [selectedLocation, setSelectedLocation] = useState<typeof MCLEOD_LAKE_LOCATION | null>(null)
  const [searchInput, setSearchInput] = useState('')

  const centerOnMcLeod = () => {
    setViewState({
      longitude: MCLEOD_LAKE_LOCATION.coordinates[0],
      latitude: MCLEOD_LAKE_LOCATION.coordinates[1],
      zoom: 12,
      bearing: 0,
      pitch: 0,
      transitionDuration: 2000
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Map Explorer</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search for a location..."
              className="flex-1"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button 
              variant="secondary"
              onClick={centerOnMcLeod}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Center on McLeod Lake
            </Button>
          </div>
        </Card>
        
        <Card className="h-[600px] w-full relative overflow-hidden">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(state => ({
              ...evt.viewState,
              transitionDuration: state.transitionDuration
            }))}
            mapStyle="mapbox://styles/jacemccord/cm6ifqzeb00a101re33gth867"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            <Marker 
              longitude={MCLEOD_LAKE_LOCATION.coordinates[0]}
              latitude={MCLEOD_LAKE_LOCATION.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedLocation(MCLEOD_LAKE_LOCATION);
              }}
            >
              <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg cursor-pointer" />
            </Marker>
          </Map>
          
          <div className="absolute bottom-8 left-2 bg-slate-800 text-white p-2 rounded shadow z-10 text-sm space-y-1">
            <p>Center: {viewState.longitude.toFixed(4)}, {viewState.latitude.toFixed(4)}</p>
            <p>Zoom: {viewState.zoom.toFixed(2)}</p>
            <p>Marker: {MCLEOD_LAKE_LOCATION.coordinates[0].toFixed(4)}, {MCLEOD_LAKE_LOCATION.coordinates[1].toFixed(4)}</p>
          </div>
        </Card>

        {selectedLocation && (
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{selectedLocation.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-600">Chief</h3>
                  <p>{selectedLocation.chief}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Phone Number</h3>
                  <p>{selectedLocation.phoneNumber}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold text-gray-600">Address</h3>
                  <p>{selectedLocation.address}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
