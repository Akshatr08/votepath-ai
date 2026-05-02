"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Navigation, Plus, Minus, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";

const MOCK_LOCATIONS = [
  {
    id: "1",
    name: "Central Library Community Center",
    type: "Polling Booth",
    address: "123 Civic Plaza, Downtown",
    distance: "0.8 miles",
    status: "open",
    wait: "15 mins",
    position: { lat: 28.6139, lng: 77.2090 },
  },
  {
    id: "2",
    name: "North Side High School",
    type: "Polling Booth",
    address: "456 Education Lane, Northside",
    distance: "1.2 miles",
    status: "open",
    wait: "5 mins",
    position: { lat: 28.6239, lng: 77.2190 },
  },
  {
    id: "3",
    name: "County Election Office",
    type: "Registration Center",
    address: "789 Administration Blvd",
    distance: "2.5 miles",
    status: "closed",
    wait: "-",
    position: { lat: 28.6039, lng: 77.1990 },
  },
];

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

function MapControls({ onCenterMe }: { onCenterMe: () => void }) {
  const map = useMap();
  
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      <button 
        onClick={() => map?.setZoom((map.getZoom() || 10) + 1)}
        className="p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button 
        onClick={() => map?.setZoom((map.getZoom() || 10) - 1)}
        className="p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button 
        onClick={onCenterMe}
        className="p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors text-primary"
        aria-label="Center on my location"
      >
        <Target className="w-4 h-4" />
      </button>
    </div>
  );
}

export function LocatorClient(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(13);

  const handleUseMyLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          setZoom(15);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <APIProvider 
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      solutionChannel="gmp_mcp_codeassist_v0.1_github"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold mb-4">
            Polling <span className="gradient-text">Locator</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find your nearest polling station, registration office, or help center.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your zip code or address..."
                aria-label="Search by zip code or address"
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label="Filter polling locations">
              {["all", "booth", "registration", "help"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {MOCK_LOCATIONS.map((loc) => (
                <Card 
                  key={loc.id} 
                  className="cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => {
                    setCenter(loc.position);
                    setZoom(16);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary mb-1 block">
                          {loc.type}
                        </span>
                        <h3 className="font-bold text-sm">{loc.name}</h3>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        loc.status === "open" ? "bg-green-500" : "bg-destructive"
                      )}
                        role="img"
                        aria-label={loc.status === "open" ? "Open" : "Closed"}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{loc.address}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium">{loc.distance} away</span>
                      <span className="text-muted-foreground">Wait: {loc.wait}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 relative bg-secondary rounded-2xl border border-border overflow-hidden shadow-inner">
            <Map
              mapId="DEMO_MAP_ID"
              center={center}
              zoom={zoom}
              onCenterChanged={(ev) => setCenter(ev.detail.center)}
              onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
              gestureHandling="greedy"
              disableDefaultUI={true}
              className="w-full h-full"
            >
              {MOCK_LOCATIONS.map((loc) => (
                <AdvancedMarker
                  key={loc.id}
                  position={loc.position}
                  title={loc.name}
                  onClick={() => {
                    setCenter(loc.position);
                    setZoom(17);
                  }}
                >
                  <Pin 
                    background={loc.status === "open" ? "#3b82f6" : "#ef4444"} 
                    borderColor={"#ffffff"} 
                    glyphColor={"#ffffff"} 
                  />
                </AdvancedMarker>
              ))}
            </Map>
            
            <MapControls onCenterMe={handleUseMyLocation} />

            <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10 pointer-events-none">
              <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-lg flex items-center gap-2 pointer-events-auto">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Find nearest polling station</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[10px] px-2 ml-2"
                  onClick={handleUseMyLocation}
                >
                  Use My Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
