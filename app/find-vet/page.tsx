"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, Star, Building, Award } from "lucide-react"
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function FindVet() {
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVet, setSelectedVet] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")

  // Mock availability data (would come from backend in a real app)
  const availabilityMap = {
    "Monday": ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"],
    "Tuesday": ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"],
    "Wednesday": ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"],
    "Thursday": ["09:00 AM", "10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"],
    "Friday": ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "04:00 PM"],
  }
  
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Fetch veterinarians on component mount
useEffect(() => {
  const fetchVeterinarians = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:5000/api/veterinarians')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch veterinarians: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Process the data...
      const vetsWithAdditionalData = data.data.map(vet => ({
        id: vet._id,
        name: vet.name,
        specialty: "General Veterinarian", 
        location: vet.businessName || "Animal Clinic",
        rating: (4 + Math.random()).toFixed(1),
        availability: weekdays
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 3),
        about: `${vet.name} is an experienced veterinarian at ${vet.businessName || "Animal Clinic"}.`,
        image: `https://via.placeholder.com/300`,
        phone: vet.phoneNumber || "Not provided",
        licenseNumber: vet.licenseNumber || "Not provided"
      }))
      
      setVets(vetsWithAdditionalData)
    } catch (err) {
      console.error("Error fetching veterinarians:", err)
      setError("Failed to load veterinarians. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  fetchVeterinarians()
}, [])

  const filteredVets = vets.filter((vet) => {
    const matchesSearch = 
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vet.businessName && vet.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vet.location && vet.location.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const handleVetSelect = (vet) => {
    setSelectedVet(vet)
  }
const handleBookAppointment = async () => {
  if (!selectedVet || !selectedDate || !selectedTime) return;

  try {
    const res = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If user authentication is needed, add Authorization header here
      },
      body: JSON.stringify({
        vetId: selectedVet.id,
        vetName: selectedVet.name,
        vetBusiness: selectedVet.businessName,
        date: selectedDate,
        time: selectedTime,
        // Optionally add user info if logged in
      }),
    });

    if (!res.ok) throw new Error("Failed to book appointment");
    alert(`Appointment booked with ${selectedVet.name} on ${selectedDate} at ${selectedTime}`);
    setSelectedVet(null);
    setSelectedDate(null);
    setSelectedTime("");
  } catch (err) {
    alert("Failed to book appointment. Please try again.");
  }
};

  if (loading) {
    return (
      <div className="container py-16 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading</h2>
          <p className="text-muted-foreground">Fetching veterinarians...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-16 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Veterinarian</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>Narrow down your search results</CardDescription>
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
          {filteredVets.length > 0 ? (
            filteredVets.map((vet) => (
              <Card key={vet.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-4 flex justify-center items-center">
                    <img
                      src={vet.image || "/api/placeholder/300/300"}
                      alt={vet.name}
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                  <div className="md:w-3/4 p-4">
                    <CardHeader className="p-0 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{vet.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{vet.rating}</span>
                        </div>
                      </div>
                      <CardDescription>{vet.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pb-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {vet.businessName || "Animal Clinic"}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Award className="h-4 w-4 mr-1" />
                        License: {vet.licenseNumber}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        {vet.phoneNumber}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        Available: {vet.availability.join(", ")}
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 pt-2">
                      <Button onClick={() => handleVetSelect(vet)}>Book Appointment</Button>
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

      {selectedVet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Book Appointment with {selectedVet.name}</CardTitle>
              <CardDescription>{selectedVet.businessName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Tabs defaultValue="availability" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="availability">Availability</TabsTrigger>
                  </TabsList>
<TabsContent value="calendar" className="p-4">
  <div>
    <label htmlFor="date">Select Date:</label>
    <input type="date" id="date" name="date" />
  </div>
</TabsContent>
                  <TabsContent value="availability" className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Available days:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVet.availability.map((day) => (
                          <Button
                            key={day}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDate(day)}
                            className={selectedDate === day ? "bg-primary text-primary-foreground" : ""}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDate && availabilityMap[selectedDate]?.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedVet(null)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment} disabled={!selectedDate || !selectedTime}>
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}