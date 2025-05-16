"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CalendarDays, Clock, Edit, Plus, Save, Trash2, X } from "lucide-react"

// Mock data for working hours
const defaultWorkingHours = [
  { day: "Monday", isWorking: true, startTime: "09:00", endTime: "17:00" },
  { day: "Tuesday", isWorking: true, startTime: "09:00", endTime: "17:00" },
  { day: "Wednesday", isWorking: true, startTime: "09:00", endTime: "17:00" },
  { day: "Thursday", isWorking: true, startTime: "09:00", endTime: "17:00" },
  { day: "Friday", isWorking: true, startTime: "09:00", endTime: "17:00" },
  { day: "Saturday", isWorking: false, startTime: "09:00", endTime: "13:00" },
  { day: "Sunday", isWorking: false, startTime: "09:00", endTime: "13:00" },
]

// Mock data for time off
const timeOffData = [
  { id: 1, startDate: "2023-05-25", endDate: "2023-05-27", reason: "Personal leave", status: "Approved" },
  { id: 2, startDate: "2023-06-15", endDate: "2023-06-22", reason: "Vacation", status: "Pending" },
  { id: 3, startDate: "2023-07-10", endDate: "2023-07-10", reason: "Medical appointment", status: "Approved" },
]

// Mock data for appointment slots
const appointmentSlots = [
  { id: 1, date: "2023-05-15", startTime: "09:00", endTime: "09:30", status: "Available" },
  { id: 2, date: "2023-05-15", startTime: "09:30", endTime: "10:00", status: "Booked" },
  { id: 3, date: "2023-05-15", startTime: "10:00", endTime: "10:30", status: "Available" },
  { id: 4, date: "2023-05-15", startTime: "10:30", endTime: "11:00", status: "Booked" },
  { id: 5, date: "2023-05-15", startTime: "11:00", endTime: "11:30", status: "Available" },
  { id: 6, date: "2023-05-15", startTime: "11:30", endTime: "12:00", status: "Available" },
  { id: 7, date: "2023-05-15", startTime: "13:00", endTime: "13:30", status: "Booked" },
  { id: 8, date: "2023-05-15", startTime: "13:30", endTime: "14:00", status: "Available" },
  { id: 9, date: "2023-05-15", startTime: "14:00", endTime: "14:30", status: "Available" },
  { id: 10, date: "2023-05-15", startTime: "14:30", endTime: "15:00", status: "Booked" },
]

export default function AvailabilityPage() {
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours)
  const [timeOff, setTimeOff] = useState(timeOffData)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddTimeOffOpen, setIsAddTimeOffOpen] = useState(false)
  const [newTimeOff, setNewTimeOff] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [timeOffToDelete, setTimeOffToDelete] = useState(null)
  const [isDeleteTimeOffOpen, setIsDeleteTimeOffOpen] = useState(false)

  const handleWorkingHoursChange = (index, field, value) => {
    const updatedHours = [...workingHours]
    updatedHours[index][field] = value
    setWorkingHours(updatedHours)
  }

  const handleSaveWorkingHours = () => {
    // In a real app, this would save the working hours to the database
    console.log("Saving working hours:", workingHours)
    // Show success message
    alert("Working hours saved successfully!")
  }

  const handleAddTimeOff = () => {
    // In a real app, this would add the time off to the database
    const newTimeOffEntry = {
      id: timeOff.length + 1,
      ...newTimeOff,
      status: "Pending",
    }
    setTimeOff([...timeOff, newTimeOffEntry])
    setNewTimeOff({
      startDate: "",
      endDate: "",
      reason: "",
    })
    setIsAddTimeOffOpen(false)
  }

  const handleDeleteTimeOff = () => {
    // In a real app, this would delete the time off from the database
    const updatedTimeOff = timeOff.filter((item) => item.id !== timeOffToDelete)
    setTimeOff(updatedTimeOff)
    setIsDeleteTimeOffOpen(false)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Availability Management</h2>
          <p className="text-muted-foreground">Manage your working hours and time off</p>
        </div>
      </div>

      <Tabs defaultValue="working-hours" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
          <TabsTrigger value="time-off">Time Off</TabsTrigger>
          <TabsTrigger value="appointment-slots">Appointment Slots</TabsTrigger>
        </TabsList>

        {/* Working Hours Tab */}
        <TabsContent value="working-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regular Working Hours</CardTitle>
              <CardDescription>Set your regular working hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Working</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workingHours.map((day, index) => (
                    <TableRow key={day.day}>
                      <TableCell>{day.day}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={day.isWorking}
                          onCheckedChange={(checked) => handleWorkingHoursChange(index, "isWorking", checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={day.startTime}
                          onValueChange={(value) => handleWorkingHoursChange(index, "startTime", value)}
                          disabled={!day.isWorking}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Start Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="08:30">8:30 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="09:30">9:30 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="10:30">10:30 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={day.endTime}
                          onValueChange={(value) => handleWorkingHoursChange(index, "endTime", value)}
                          disabled={!day.isWorking}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="End Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                            <SelectItem value="17:00">5:00 PM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                            <SelectItem value="19:00">7:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveWorkingHours}>
                <Save className="mr-2 h-4 w-4" />
                Save Working Hours
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Time Off Tab */}
        <TabsContent value="time-off" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Time Off Requests</CardTitle>
                <CardDescription>Manage your time off and vacation days</CardDescription>
              </div>
              <Dialog open={isAddTimeOffOpen} onOpenChange={setIsAddTimeOffOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Time Off
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Time Off</DialogTitle>
                    <DialogDescription>Fill in the details for your time off request.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <input
                          id="start-date"
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newTimeOff.startDate}
                          onChange={(e) => setNewTimeOff({ ...newTimeOff, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <input
                          id="end-date"
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newTimeOff.endDate}
                          onChange={(e) => setNewTimeOff({ ...newTimeOff, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Select
                        value={newTimeOff.reason}
                        onValueChange={(value) => setNewTimeOff({ ...newTimeOff, reason: value })}
                      >
                        <SelectTrigger id="reason">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                          <SelectItem value="Personal leave">Personal leave</SelectItem>
                          <SelectItem value="Sick leave">Sick leave</SelectItem>
                          <SelectItem value="Medical appointment">Medical appointment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTimeOffOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTimeOff}>Submit Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeOff.length > 0 ? (
                    timeOff.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(item.startDate)}
                              {item.startDate !== item.endDate && ` to ${formatDate(item.endDate)}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              item.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : item.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            }`}
                          >
                            {item.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog
                            open={isDeleteTimeOffOpen && timeOffToDelete === item.id}
                            onOpenChange={(open) => {
                              setIsDeleteTimeOffOpen(open)
                              if (!open) setTimeOffToDelete(null)
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTimeOffToDelete(item.id)}
                                disabled={item.status === "Approved"}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this time off request.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteTimeOff}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No time off requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointment Slots Tab */}
        <TabsContent value="appointment-slots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Slots</CardTitle>
              <CardDescription>Manage your available appointment slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Slots for{" "}
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Selected Date"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Showing available and booked slots for the selected date.
                      </p>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Slot
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointmentSlots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  slot.status === "Available"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                }`}
                              >
                                {slot.status}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" disabled={slot.status === "Booked"}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" disabled={slot.status === "Booked"}>
                                  <X className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
