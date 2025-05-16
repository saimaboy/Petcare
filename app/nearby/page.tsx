"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"

// Mock data for nearby services
const services = [
  {
    id: 1,
    name: "City Pet Hospital",
    type: "Hospital",
    address: "123 Main St, City",
    phone: "+1 (555) 123-4567",
    hours: "24/7 Emergency Services",
    distance: "0.8 miles",
    image: "/placeholder.svg?height=200&width=300",
    website: "https://content3.jdmagicbox.com/comp/kota-rajasthan/a1/9999px744.x744.220318203038.f1a1/catalogue/city-pet-hospital-station-road-kota-rajasthan-hospitals-t3gwp1jo6i.jpg",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 2,
    name: "PetMeds Pharmacy",
    type: "Pharmacy",
    address: "456 Oak Ave, City",
    phone: "+1 (555) 987-6543",
    hours: "Mon-Sat: 9AM-9PM, Sun: 10AM-6PM",
    distance: "1.2 miles",
    image: "/placeholder.svg?height=200&width=300",
    website: "https://petphoto.1800petmeds.com/images/meta-image-revised2.png",
    lat: 40.7138,
    lng: -74.008,
  },
  {
    id: 3,
    name: "Animal Emergency Center",
    type: "Hospital",
    address: "789 Pine Rd, City",
    phone: "+1 (555) 456-7890",
    hours: "24/7 Emergency Services",
    distance: "2.5 miles",
    image: "/placeholder.svg?height=200&width=300",
    website: "https://okcanimalemergency.com/wp-content/uploads/2022/09/AnimalEmergencyFinal.png",
    lat: 40.7148,
    lng: -74.003,
  },
  {
    id: 4,
    name: "Pet Wellness Pharmacy",
    type: "Pharmacy",
    address: "321 Elm St, City",
    phone: "+1 (555) 234-5678",
    hours: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM",
    distance: "3.1 miles",
    image: "/placeholder.svg?height=200&width=300",
    website: "https://www.animalwellness.com/sites/site-3490/images/Shop_Now_Button_6.png",
    lat: 40.7118,
    lng: -74.009,
  },
]

export default function NearbyServices() {
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceType, setServiceType] = useState("all")
  const [userLocation, setUserLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Please enable location services.")
          setIsLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setIsLoading(false)
    }
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = serviceType === "all" || service.type.toLowerCase() === serviceType.toLowerCase()
    return matchesSearch && matchesType
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nearby Pet Services</h1>

      <div className="mb-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
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
                        variant={serviceType === "hospital" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("hospital")}
                      >
                        Hospitals
                      </Button>
                      <Button
                        variant={serviceType === "pharmacy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setServiceType("pharmacy")}
                      >
                        Pharmacies
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
                    <Card key={service.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
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
                              {service.address}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Phone className="h-4 w-4 mr-1" />
                              {service.phone}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.hours}
                            </div>
                          </CardContent>
                          <CardFooter className="p-0 pt-2 flex gap-2">
                            <Button variant="outline" size="sm">
                              Get Directions
                            </Button>
                            <Button size="sm">Call Now</Button>
                            <Button variant="ghost" size="sm" className="ml-auto" asChild>
                              <a href={service.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Website
                              </a>
                            </Button>
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
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  {isLoading ? (
                    <p className="text-muted-foreground">Loading map...</p>
                  ) : error ? (
                    <div className="text-center">
                      <p className="text-red-500 mb-4">{error}</p>
                      <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        Map view would display here with markers for each service.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In a production environment, this would integrate with Google Maps or a similar mapping service.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

