"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, Star } from "lucide-react"

// Mock data for veterinarians
const vets = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Veterinarian",
    location: "123 Pet Care St, City",
    rating: 4.8,
    image: "https://veterinary.rossu.edu/sites/g/files/krcnkv416/files/styles/atge_default_md/public/2021-07/dei-initiatives-access-to-inclusive-veterinary-medicine_hero_1.jpg?itok=uXnRI1Pb",
    availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
    phone: "+1 (555) 123-4567",
    about:
      "Dr. Sarah Johnson has over 10 years of experience in general veterinary care. She specializes in preventive care and minor surgeries.",
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    specialty: "Veterinary Surgeon",
    location: "456 Animal Health Ave, City",
    rating: 4.9,
    image: "https://cdn.phenompeople.com/CareerConnectResources/PEQPETUS/images/Vital_Care_04_0267NonNonCompete13-1675120214406.jpg",
    availability: ["Monday", "Thursday", "Friday"],
    phone: "+1 (555) 987-6543",
    about:
      "Dr. Michael Rodriguez is a board-certified veterinary surgeon with expertise in orthopedic and soft tissue surgeries.",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Veterinary Dermatologist",
    location: "789 Pet Wellness Blvd, City",
    rating: 4.7,
    image: "https://www.success.com/wp-content/uploads/2025/01/veterinarian-best-job-2025-1024x682.jpg",
    availability: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
    phone: "+1 (555) 456-7890",
    about:
      "Dr. Emily Chen specializes in diagnosing and treating skin conditions in pets. She has a particular interest in allergic dermatitis.",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Veterinary Dentist",
    location: "321 Animal Smile Dr, City",
    rating: 4.6,
    image: "https://veterinary.stmatthews.edu/uploads/sites/8/2020/09/smu-1187228710.webp?w=920",
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
    phone: "+1 (555) 234-5678",
    about:
      "Dr. James Wilson focuses on pet dental health, including cleanings, extractions, and treating oral diseases.",
  },
]

export default function FindVet() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [selectedVet, setSelectedVet] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")

  const filteredVets = vets.filter((vet) => {
    const matchesSearch =
      vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = specialty === "" || vet.specialty === specialty
    return matchesSearch && matchesSpecialty
  })

  const handleVetSelect = (vet) => {
    setSelectedVet(vet)
  }

  const handleBookAppointment = () => {
    alert(`Appointment booked with ${selectedVet.name} on ${selectedDate} at ${selectedTime}`)
    setSelectedVet(null)
    setSelectedDate(null)
    setSelectedTime("")
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
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="General Veterinarian">General Veterinarian</SelectItem>
                  <SelectItem value="Veterinary Surgeon">Veterinary Surgeon</SelectItem>
                  <SelectItem value="Veterinary Dermatologist">Veterinary Dermatologist</SelectItem>
                  <SelectItem value="Veterinary Dentist">Veterinary Dentist</SelectItem>
                </SelectContent>
              </Select>
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
                      src={vet.image || "/placeholder.svg"}
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
                        <MapPin className="h-4 w-4 mr-1" />
                        {vet.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Phone className="h-4 w-4 mr-1" />
                        {vet.phone}
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
              <CardDescription>{selectedVet.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="availability">Availability</TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar" className="p-4">
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
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
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
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

