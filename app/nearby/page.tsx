"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default function NearbyServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  // Helper function to geocode street address
  const geocodeStreet = async (street) => {
    if (!street) return null;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street)}&key=AIzaSyCjjuJkNoQp-ozJZWVnjzrByN_pz-drwho`
      );
      const data = await response.json();
      console.log("Geocode Response for", street, ":", data); // Debug: Log geocode response
      if (data.status === "OK" && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      console.warn("Geocode failed for street:", street, data.status);
      return null;
    } catch (err) {
      console.error("Geocode Error:", err);
      return null;
    }
  };

  // Fetch services from API and ge polem code street addresses
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/users/vets-and-pharmacies")
      .then((res) => res.json())
      .then(async (data) => {
        console.log("API Response:", data); // Debug: Log API response
        const formattedServices = await Promise.all(
          (data.data || []).map(async (service) => {
            let lat = service.location?.coordinates?.[1] || service.latitude;
            let lng = service.location?.coordinates?.[0] || service.longitude;

            // If address is an object with a street field, try to geocode it
            if (typeof service.address === "object" && service.address.street) {
              const coords = await geocodeStreet(service.address.street);
              if (coords) {
                lat = coords.lat;
                lng = coords.lng;
              }
            }

            return {
              ...service,
              type: service.role === "veterinarian" ? "Veterinarian" : "Pharmacy",
              distance: "Calculating...",
              lat,
              lng,
              hours: service.operatingHours || "Not specified",
              image: service.image || "/placeholder.svg?height=200&width=300",
            };
          })
        );
        setServices(formattedServices);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err); // Debug: Log fetch error
        setError("Failed to fetch services.");
        setIsLoading(false);
      });
  }, []);

  // Load Google Maps API
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCjjuJkNoQp-ozJZWVnjzrByN_pz-drwho&libraries=places`;
      googleMapScript.async = true;
      googleMapScript.defer = true;

      googleMapScript.addEventListener("load", () => {
        console.log("Google Maps API loaded"); // Debug: Confirm API load
        setMapLoaded(true);
      });

      googleMapScript.addEventListener("error", () => {
        console.error("Google Maps API load error"); // Debug: Log API error
        setError("Failed to load Google Maps. Please try again later.");
        setIsLoading(false);
      });

      document.body.appendChild(googleMapScript);
    } else if (window.google) {
      console.log("Google Maps API already loaded"); // Debug: Confirm existing API
      setMapLoaded(true);
    }
  }, []);

  // Get user's location and calculate distances
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User Location:", userLoc); // Debug: Log user location
          setUserLocation(userLoc);

          // Calculate distances to each service once we have user location
          setServices((prevServices) =>
            prevServices.map((service) => {
              if (service.lat && service.lng) {
                const distance = calculateDistance(
                  userLoc.lat,
                  userLoc.lng,
                  service.lat,
                  service.lng
                );
                return {
                  ...service,
                  distance: `${distance.toFixed(1)} miles`,
                };
              }
              return service;
            })
          );
        },
        (error) => {
          console.error("Geolocation Error:", error); // Debug: Log geolocation error
          setError("Unable to get your location. Please enable location services.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Initialize map when Google Maps is loaded and user location is available
  useEffect(() => {
    if (mapLoaded && userLocation && mapRef.current && !googleMapRef.current) {
      console.log("Initializing map"); // Debug: Log map initialization
      initMap();
    }
  }, [mapLoaded, userLocation]);

  // Initialize Google Map
  const initMap = () => {
    const mapOptions = {
      center: userLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    googleMapRef.current = map;
    console.log("Map initialized:", map); // Debug: Log map object

    // Add user location marker
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4F46E5",
        fillOpacity: 0.7,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
      title: "Your Location",
    });

    // Add markers for services
    addServiceMarkers(map);
  };

  // Add markers for services
  const addServiceMarkers = (map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Filter services based on searchTerm and serviceType
    const servicesToShow = filteredServices;
    console.log("Services to show on map:", servicesToShow); // Debug: Log filtered services

    // Add markers for filtered services
    servicesToShow.forEach((service) => {
      if (!service.lat || !service.lng) {
        console.warn("Invalid coordinates for service:", service.name); // Debug: Log invalid coords
        return;
      }
      const markerIcon = {
        url:
          service.type === "Veterinarian"
            ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new window.google.maps.Size(32, 32),
      };

      const marker = new window.google.maps.Marker({
        position: { lat: service.lat, lng: service.lng },
        map: map,
        icon: markerIcon,
        title: service.name,
        animation: window.google.maps.Animation.DROP,
      });

      // Info window content
      const addressString =
        typeof service.address === "object"
          ? [service.address.street, service.address.city, service.address.state, service.address.zipCode, service.address.country]
              .filter(Boolean)
              .join(", ")
          : service.address || "N/A";

      const infoWindowContent = `
        <div style="width: 250px; padding: 10px;">
          <h3 style="margin-top: 0; font-weight: bold;">${service.name}</h3>
          <p style="margin: 5px 0; color: #666;">${service.type} · ${service.distance}</p>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${addressString}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${service.phone || "N/A"}</p>
          <div style="margin-top: 10px;">
            <button 
              style="background: #4F46E5; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;"
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}', '_blank')"
            >
              Get Directions
            </button>
            <button 
              style="background: white; color: #4F46E5; border: 1px solid #4F46E5; padding: 6px 12px; border-radius: 4px; cursor: pointer;"
              onclick="window.open('tel:${service.phone?.replace(/\D/g, '')}', '_self')"
            >
              Call
            </button>
          </div>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      marker.addListener("click", () => {
        if (activeService) {
          activeService.close();
        }
        infoWindow.open(map, marker);
        setActiveService(infoWindow);
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to fit all markers if we have services
    if (servicesToShow.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(userLocation);
      servicesToShow.forEach((service) => {
        if (service.lat && service.lng) {
          bounds.extend({ lat: service.lat, lng: service.lng });
        }
      });
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 16) map.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    } else {
      console.log("No services to display on map"); // Debug: Log if no services
    }
  };

  // Filtering logic
  const filteredServices = services.filter((service) => {
    const name = service.name || service.businessName || "";
    const address =
      typeof service.address === "object"
        ? [service.address.street, service.address.city, service.address.state, service.address.zipCode, service.address.country]
            .filter(Boolean)
            .join(", ")
        : service.address || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      serviceType === "all" ||
      (serviceType === "veterinarian" && service.type === "Veterinarian") ||
      (serviceType === "pharmacy" && service.type === "Pharmacy");
    return matchesSearch && matchesType;
  });

  // Update markers when filters change
  useEffect(() => {
    if (googleMapRef.current) {
      console.log("Updating markers with new filters"); // Debug: Log filter update
      addServiceMarkers(googleMapRef.current);
    }
  }, [searchTerm, serviceType, services]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nearby Pet Services</h1>

      <div className="mb-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Find services near you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Service Type</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={serviceType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={serviceType === "veterinarian" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("veterinarian")}
                      >
                        Veterinarians
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">Loading nearby services...</p>
                  </div>
                ) : error ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card key={service.id || service._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">

                        <div className="md:w-2/3 p-4">
                          <CardHeader className="p-0 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{service.name}</CardTitle>
                                <CardDescription>{service.type}</CardDescription>
                              </div>
                              <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                                {service.distance}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0 pb-2">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {typeof service.address === "object"
                                ? [service.address.street, service.address.city, service.address.state, service.address.zipCode, service.address.country]
                                    .filter(Boolean)
                                    .join(", ")
                                : service.address || "N/A"}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Phone className="h-4 w-4 mr-1" />
                              {service.phone || "N/A"}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.hours}
                            </div>
                          </CardContent>
                          <CardFooter className="p-0 pt-2 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`, "_blank")}
                            >
                              Get Directions
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.open(`tel:${service.phone?.replace(/\D/g, "")}`, "_self")}
                            >
                              Call Now
                            </Button>
                            {service.website && (
                              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                                <a href={service.website} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Website
                                </a>
                              </Button>
                            )}
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No services found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Find services near you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="map-search">Search</Label>
                    <Input
                      id="map-search"
                      placeholder="Search by name or location"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="map-type">Service Type</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={serviceType === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={serviceType === "veterinarian" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("veterinarian")}
                      >
                        Veterinarians
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    <p>🔴 Veterinarian</p>
                    <p>🔵 Pharmacy</p>
                    <p>🟣 Your Location</p>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div
                        ref={mapRef}
                        className="w-full h-96 rounded-md overflow-hidden"
                        style={{ minHeight: "500px" }}
                      ></div>
                      {filteredServices.length === 0 && (
                        <div className="text-center mt-4">
                          <p className="text-muted-foreground">No services found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}