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
  address: string
  population: string
  coordinates: readonly [number, number]
}

// Define the exact coordinates for McLeod Lake
const MCLEOD_LAKE_FIRST_NATION = {
  id: '1',
  name: 'McLeod Lake Indian Band',
  chief: 'Chief Harley Chingee',
  address: 'General Delivery, McLeod Lake, BC V0J 2G0',
  population: '584',
  coordinates: [-123.0890, 55.0379]
} as const;

const WEST_MOBERLY_FIRST_NATION = {
  id: '2',
  name: 'West Moberly First Nation',
  chief: 'Chief Roland Willson',
  address: 'Box 90, Moberly Lake, BC V0J 1X0',
  population: '374',
  coordinates: [-121.8336145, 55.8305921]
} as const;

const locations: LocationDetails[] = [
  MCLEOD_LAKE_FIRST_NATION,
  WEST_MOBERLY_FIRST_NATION
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

console.log('McLeod Lake coordinates:', MCLEOD_LAKE_FIRST_NATION.coordinates);

// Add this function before the MapExplorer component
const searchLocations = (searchText: string, locations: LocationDetails[]) => {
  const searchLower = searchText.toLowerCase();
  return locations.filter(location => 
    location.name.toLowerCase().includes(searchLower) ||
    location.chief.toLowerCase().includes(searchLower) ||
    location.address.toLowerCase().includes(searchLower)
  );
};

export default function MapExplorer() {
  const [viewState, setViewState] = useState<ViewStateType>({
    longitude: MCLEOD_LAKE_FIRST_NATION.coordinates[0],
    latitude: MCLEOD_LAKE_FIRST_NATION.coordinates[1],
    zoom: 5,
    bearing: 0,
    pitch: 0,
    transitionDuration: 0
  })
  
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<LocationDetails[]>([])

  const centerOnMcLeod = () => {
    setViewState({
      longitude: MCLEOD_LAKE_FIRST_NATION.coordinates[0],
      latitude: MCLEOD_LAKE_FIRST_NATION.coordinates[1],
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
              variant="default"
              onClick={() => {
                if (searchInput.trim()) {
                  const results = searchLocations(searchInput, locations);
                  setSearchResults(results);
                  if (results.length > 0) {
                    // Center map on first result
                    setViewState({
                      longitude: results[0].coordinates[0],
                      latitude: results[0].coordinates[1],
                      zoom: 12,
                      bearing: 0,
                      pitch: 0,
                      transitionDuration: 2000
                    });
                    setSelectedLocation(results[0]);
                  }
                }
              }}
            >
              Search
            </Button>
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
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
          >
            {locations.map((location) => (
              <Marker 
                key={location.id}
                longitude={location.coordinates[0]}
                latitude={location.coordinates[1]}
                anchor="center"
                className="mapboxgl-marker"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedLocation(location);
                }}
              >
                <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg cursor-pointer" />
              </Marker>
            ))}
          </Map>
          
          <div className="absolute bottom-8 left-2 bg-slate-800 text-white p-2 rounded shadow z-10 text-sm space-y-1">
            <p>Center: {viewState.longitude.toFixed(4)}, {viewState.latitude.toFixed(4)}</p>
            <p>Zoom: {viewState.zoom.toFixed(2)}</p>
            <p>Marker: {MCLEOD_LAKE_FIRST_NATION.coordinates[0].toFixed(4)}, {MCLEOD_LAKE_FIRST_NATION.coordinates[1].toFixed(4)}</p>
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
                  <h3 className="font-semibold text-gray-600">Population</h3>
                  <p>{selectedLocation.population}</p>
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
