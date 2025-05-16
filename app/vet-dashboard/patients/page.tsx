"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, MoreHorizontal, Plus, Search, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for patients
const patients = [
  {
    id: 1,
    petName: "Max",
    petType: "Dog",
    breed: "Golden Retriever",
    age: "5 years",
    ownerName: "John Smith",
    ownerEmail: "john.smith@example.com",
    ownerPhone: "(555) 123-4567",
    lastVisit: "2023-05-10",
    status: "Healthy",
    medicalHistory: [
      { date: "2023-05-10", type: "Check-up", notes: "Annual wellness exam, all vitals normal" },
      { date: "2022-11-15", type: "Vaccination", notes: "Rabies and DHPP boosters administered" },
      { date: "2022-06-22", type: "Illness", notes: "Treated for mild ear infection" },
    ],
  },
  {
    id: 2,
    petName: "Bella",
    petType: "Cat",
    breed: "Siamese",
    age: "3 years",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah.j@example.com",
    ownerPhone: "(555) 987-6543",
    lastVisit: "2023-05-12",
    status: "Follow-up needed",
    medicalHistory: [
      { date: "2023-05-12", type: "Dental", notes: "Dental cleaning performed, minor tartar buildup" },
      { date: "2023-02-05", type: "Check-up", notes: "Slight weight gain noted, dietary recommendations provided" },
      { date: "2022-08-30", type: "Vaccination", notes: "FVRCP and FeLV vaccines administered" },
    ],
  },
  {
    id: 3,
    petName: "Charlie",
    petType: "Dog",
    breed: "Beagle",
    age: "7 years",
    ownerName: "Michael Davis",
    ownerEmail: "mdavis@example.com",
    ownerPhone: "(555) 456-7890",
    lastVisit: "2023-05-08",
    status: "Recovering",
    medicalHistory: [
      { date: "2023-05-08", type: "Surgery", notes: "Dental extraction of two molars, recovering well" },
      { date: "2023-04-20", type: "Check-up", notes: "Dental issues identified, surgery scheduled" },
      { date: "2022-10-12", type: "Vaccination", notes: "Annual vaccinations administered" },
    ],
  },
  {
    id: 4,
    petName: "Luna",
    petType: "Cat",
    breed: "Maine Coon",
    age: "2 years",
    ownerName: "Emily Wilson",
    ownerEmail: "emily.w@example.com",
    ownerPhone: "(555) 234-5678",
    lastVisit: "2023-05-05",
    status: "Healthy",
    medicalHistory: [
      { date: "2023-05-05", type: "Check-up", notes: "Annual wellness exam, all vitals normal" },
      { date: "2022-11-10", type: "Vaccination", notes: "FVRCP booster administered" },
      { date: "2022-05-15", type: "Spay", notes: "Routine spay procedure, no complications" },
    ],
  },
  {
    id: 5,
    petName: "Cooper",
    petType: "Dog",
    breed: "Labrador",
    age: "4 years",
    ownerName: "David Brown",
    ownerEmail: "dbrown@example.com",
    ownerPhone: "(555) 876-5432",
    lastVisit: "2023-05-02",
    status: "Follow-up needed",
    medicalHistory: [
      { date: "2023-05-02", type: "Check-up", notes: "Weight management follow-up, slight improvement" },
      { date: "2023-03-15", type: "Check-up", notes: "Overweight, dietary plan established" },
      { date: "2022-09-20", type: "Vaccination", notes: "Annual vaccinations administered" },
    ],
  },
  {
    id: 6,
    petName: "Lily",
    petType: "Cat",
    breed: "Persian",
    age: "6 years",
    ownerName: "Jessica Lee",
    ownerEmail: "jlee@example.com",
    ownerPhone: "(555) 345-6789",
    lastVisit: "2023-04-28",
    status: "Healthy",
    medicalHistory: [
      { date: "2023-04-28", type: "Grooming", notes: "Full grooming session, coat in good condition" },
      { date: "2023-01-15", type: "Check-up", notes: "Annual wellness exam, all vitals normal" },
      { date: "2022-07-10", type: "Illness", notes: "Treated for hairball-related issues" },
    ],
  },
  {
    id: 7,
    petName: "Rocky",
    petType: "Dog",
    breed: "German Shepherd",
    age: "3 years",
    ownerName: "Robert Johnson",
    ownerEmail: "rjohnson@example.com",
    ownerPhone: "(555) 567-8901",
    lastVisit: "2023-04-25",
    status: "Healthy",
    medicalHistory: [
      { date: "2023-04-25", type: "Check-up", notes: "Annual wellness exam, all vitals normal" },
      { date: "2022-10-05", type: "Vaccination", notes: "Rabies and DHPP boosters administered" },
      { date: "2022-05-12", type: "Injury", notes: "Treated for minor paw injury" },
    ],
  },
  {
    id: 8,
    petName: "Milo",
    petType: "Cat",
    breed: "Ragdoll",
    age: "4 years",
    ownerName: "Amanda Miller",
    ownerEmail: "amiller@example.com",
    ownerPhone: "(555) 678-9012",
    lastVisit: "2023-04-20",
    status: "Recovering",
    medicalHistory: [
      { date: "2023-04-20", type: "Surgery", notes: "Removal of benign skin growth, recovering well" },
      { date: "2023-03-05", type: "Check-up", notes: "Skin growth identified, biopsy performed" },
      { date: "2022-08-15", type: "Vaccination", notes: "Annual vaccinations administered" },
    ],
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [petTypeFilter, setPetTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  const filteredPatients = patients.filter((patient) => {
    // Search filter
    const matchesSearch =
      patient.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ownerName.toLowerCase().includes(searchTerm.toLowerCase())

    // Pet type filter
    const matchesPetType = petTypeFilter === "all" || patient.petType.toLowerCase() === petTypeFilter.toLowerCase()

    // Status filter
    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesPetType && matchesStatus
  })

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient)
    setIsDetailsOpen(true)
    setActiveTab("info")
  }

  const handleAddMedicalRecord = (patientId) => {
    // In a real app, this would open a form to add a new medical record
    console.log("Adding medical record for patient:", patientId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">Manage and view all your patient records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Filters</CardTitle>
          <CardDescription>Filter patients by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search pet or owner"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pet-type">Pet Type</Label>
              <Select value={petTypeFilter} onValueChange={setPetTypeFilter}>
                <SelectTrigger id="pet-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                  <SelectItem value="bird">Birds</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Health Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="recovering">Recovering</SelectItem>
                  <SelectItem value="follow-up needed">Follow-up Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients List</CardTitle>
          <CardDescription>
            Showing {filteredPatients.length} of {patients.length} patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={patient.petName} />
                          <AvatarFallback>{patient.petName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.petName}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.petType}, {patient.breed}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{patient.ownerName}</p>
                        <p className="text-sm text-muted-foreground">{patient.ownerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{patient.lastVisit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "Healthy"
                            ? "default"
                            : patient.status === "Recovering"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(patient)}>
                            View Patient Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddMedicalRecord(patient.id)}>
                            Add Medical Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href={`/vet-dashboard/appointments?patient=${patient.id}`} className="flex w-full">
                              Schedule Appointment
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No patients found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>Detailed information about the selected patient.</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Patient Info</TabsTrigger>
                  <TabsTrigger value="history">Medical History</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={selectedPatient.petName} />
                      <AvatarFallback>{selectedPatient.petName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{selectedPatient.petName}</h3>
                      <p className="text-muted-foreground">
                        {selectedPatient.petType}, {selectedPatient.breed}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
                      <p>{selectedPatient.age}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                      <Badge
                        variant={
                          selectedPatient.status === "Healthy"
                            ? "default"
                            : selectedPatient.status === "Recovering"
                              ? "outline"
                              : "secondary"
                        }
                        className="mt-1"
                      >
                        {selectedPatient.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Owner Information</h4>
                    <div className="grid grid-cols-1 gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedPatient.ownerName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <p>{selectedPatient.ownerEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <p>{selectedPatient.ownerPhone}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Visit</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedPatient.lastVisit}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Medical History</h4>
                      <Button size="sm" variant="outline" onClick={() => handleAddMedicalRecord(selectedPatient.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </div>
                    {selectedPatient.medicalHistory.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPatient.medicalHistory.map((record, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{record.date}</p>
                                  </div>
                                  <Badge className="mt-1">{record.type}</Badge>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm">{record.notes}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No medical records found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button>
              <Link href={`/vet-dashboard/appointments?patient=${selectedPatient?.id}`} className="flex w-full">
                Schedule Appointment
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
