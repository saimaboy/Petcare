"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default function NearbyServices() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch only veterinarians from API
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/api/users/vets-and-pharmacies")
      .then((res) => res.json())
      .then(async (data) => {
        const formattedServices = (data.data || [])
          .filter(service => service.role === "veterinarian")
          .map(service => ({
            ...service,
            type: "Veterinarian",
            distance: "Calculating...",
            lat: service.location?.coordinates?.[1] || service.latitude,
            lng: service.location?.coordinates?.[0] || service.longitude,
            hours: service.operatingHours || "Not specified",
          }));
        setServices(formattedServices);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services.");
        setIsLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredServices = services.filter((service) => {
    const name = service.name || service.businessName || "";
    const address =
      typeof service.address === "object"
        ? [service.address.street, service.address.city, service.address.state, service.address.zipCode, service.address.country]
            .filter(Boolean)
            .join(", ")
        : service.address || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nearby Veterinarians</h1>

      <div className="mb-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-4">
            <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Search Filters</CardTitle>
                  <CardDescription>Find veterinarians near you</CardDescription>
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
                </CardContent>
              </Card>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">Loading nearby veterinarians...</p>
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
                        <div className="md:w-full p-4">
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
                    <p className="text-muted-foreground">No veterinarians found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}