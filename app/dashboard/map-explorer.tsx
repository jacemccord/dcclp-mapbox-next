"use client"

import { useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function MapExplorer() {
  const [viewState, setViewState] = useState({
    longitude: -123.1709324,
    latitude: 55.3264542,
    zoom: 3.5
  })

  return (
    <main className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Map Explorer</h1>
        </div>
        
        <Card className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for a location..."
                className="w-full"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>
        
        <Card className="w-full h-[600px] overflow-hidden">
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/jacemccord/cm6ifqzeb00a101re33gth867"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
            <Marker
              longitude={viewState.longitude}
              latitude={viewState.latitude}
              color="red"
            />
          </Map>
        </Card>
      </div>
    </main>
  );
}