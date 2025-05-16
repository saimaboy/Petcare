"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Check, Clock, FileEdit, MoreHorizontal, Search, X } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock data for appointments
const appointments = [
  {
    id: 1,
    petName: "Max",
    petType: "Dog",
    breed: "Golden Retriever",
    ownerName: "John Smith",
    date: "2023-05-15",
    time: "10:00 AM",
    type: "Vaccination",
    status: "Confirmed",
    notes: "Annual vaccinations due",
  },
  {
    id: 2,
    petName: "Bella",
    petType: "Cat",
    breed: "Siamese",
    ownerName: "Sarah Johnson",
    date: "2023-05-15",
    time: "11:30 AM",
    type: "Check-up",
    status: "Confirmed",
    notes: "Follow-up after treatment",
  },
  {
    id: 3,
    petName: "Charlie",
    petType: "Dog",
    breed: "Beagle",
    ownerName: "Michael Davis",
    date: "2023-05-15",
    time: "2:15 PM",
    type: "Surgery",
    status: "Confirmed",
    notes: "Dental extraction needed",
  },
  {
    id: 4,
    petName: "Luna",
    petType: "Cat",
    breed: "Maine Coon",
    ownerName: "Emily Wilson",
    date: "2023-05-16",
    time: "9:45 AM",
    type: "Dental Cleaning",
    status: "Pending",
    notes: "First dental cleaning",
  },
  {
    id: 5,
    petName: "Cooper",
    petType: "Dog",
    breed: "Labrador",
    ownerName: "David Brown",
    date: "2023-05-16",
    time: "1:00 PM",
    type: "Check-up",
    status: "Confirmed",
    notes: "Weight management follow-up",
  },
  {
    id: 6,
    petName: "Lily",
    petType: "Cat",
    breed: "Persian",
    ownerName: "Jessica Lee",
    date: "2023-05-17",
    time: "11:00 AM",
    type: "Grooming",
    status: "Confirmed",
    notes: "Full grooming session",
  },
  {
    id: 7,
    petName: "Rocky",
    petType: "Dog",
    breed: "German Shepherd",
    ownerName: "Robert Johnson",
    date: "2023-05-17",
    time: "3:30 PM",
    type: "Vaccination",
    status: "Pending",
    notes: "Booster shots needed",
  },
  {
    id: 8,
    petName: "Milo",
    petType: "Cat",
    breed: "Ragdoll",
    ownerName: "Amanda Miller",
    date: "2023-05-18",
    time: "10:30 AM",
    type: "Check-up",
    status: "Confirmed",
    notes: "Annual wellness exam",
  },
]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")

  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter.toLowerCase()

    // Type filter
    const matchesType = typeFilter === "all" || appointment.type.toLowerCase() === typeFilter.toLowerCase()

    // Date filter
    const matchesDate = !selectedDate || appointment.date === selectedDate

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setEditNotes(appointment.notes)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    // In a real app, this would update the appointment in the database
    console.log("Saving changes to appointment:", selectedAppointment.id, "New notes:", editNotes)
    setIsEditOpen(false)
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    // In a real app, this would update the appointment status in the database
    console.log("Changing status of appointment:", appointmentId, "to", newStatus)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and view all your scheduled appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <CalendarIcon className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Filters</CardTitle>
              <CardDescription>Filter appointments by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="check-up">Check-up</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="dental cleaning">Dental Cleaning</SelectItem>
                      <SelectItem value="grooming">Grooming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? selectedDate : "Pick a date"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      <div className="flex justify-end gap-2 p-4">
                        <Button variant="outline" onClick={() => setSelectedDate(null)}>
                          Clear
                        </Button>
                        <DialogTrigger asChild>
                          <Button>Apply</Button>
                        </DialogTrigger>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointments List</CardTitle>
              <CardDescription>
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.petName}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.petType}, {appointment.breed}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.ownerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.date}
                              <br />
                              <span className="text-sm text-muted-foreground">{appointment.time}</span>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === "Confirmed"
                                ? "default"
                                : appointment.status === "Pending"
                                  ? "outline"
                                  : appointment.status === "Cancelled"
                                    ? "destructive"
                                    : "secondary"
                            }
                          >
                            {appointment.status}
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
                              <DropdownMenuItem onClick={() => handleViewDetails(appointment)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                                Edit Appointment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Confirmed")}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Confirm
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Completed")}>
                                <Check className="mr-2 h-4 w-4 text-blue-600" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "Cancelled")}>
                                <X className="mr-2 h-4 w-4 text-red-600" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No appointments found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View your appointments in a calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[500px] bg-muted/20 rounded-md">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Calendar view would be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This would display a full calendar with appointment slots and details
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Detailed information about the selected appointment.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Pet Information</h4>
                  <p className="font-medium">{selectedAppointment.petName}</p>
                  <p className="text-sm">
                    {selectedAppointment.petType}, {selectedAppointment.breed}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                  <p>{selectedAppointment.ownerName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date & Time</h4>
                  <p>
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                  <p>{selectedAppointment.type}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge
                  variant={
                    selectedAppointment.status === "Confirmed"
                      ? "default"
                      : selectedAppointment.status === "Pending"
                        ? "outline"
                        : selectedAppointment.status === "Cancelled"
                          ? "destructive"
                          : "secondary"
                  }
                  className="mt-1"
                >
                  {selectedAppointment.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                <p className="mt-1">{selectedAppointment.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false)
                handleEditAppointment(selectedAppointment)
              }}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Make changes to the appointment details.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" defaultValue={selectedAppointment.date} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input id="edit-time" defaultValue={selectedAppointment.time} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Appointment Type</Label>
                <Select defaultValue={selectedAppointment.type.toLowerCase()}>
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="check-up">Check-up</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="dental cleaning">Dental Cleaning</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedAppointment.status.toLowerCase()}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea id="edit-notes" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
