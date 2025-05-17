"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, User, Settings, Plus, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VetDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [vetData, setVetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Placeholder data - would be fetched from API in production
  const upcomingAppointments = [
    { id: "1", petName: "Max", ownerName: "John Doe", time: "10:00 AM", date: "Today", reason: "Vaccination" },
    { id: "2", petName: "Bella", ownerName: "Sarah Smith", time: "11:30 AM", date: "Today", reason: "Check-up" },
    { id: "3", petName: "Charlie", ownerName: "Mike Johnson", time: "2:15 PM", date: "Today", reason: "Skin condition" },
    { id: "4", petName: "Luna", ownerName: "Emily Wilson", time: "9:45 AM", date: "Tomorrow", reason: "Annual exam" }
  ];
  
  const recentPatients = [
    { id: "101", name: "Max", species: "Dog", breed: "Golden Retriever", age: "4 years", owner: "John Doe", lastVisit: "Today" },
    { id: "102", name: "Whiskers", species: "Cat", breed: "Siamese", age: "2 years", owner: "Lisa Chen", lastVisit: "Yesterday" },
    { id: "103", name: "Daisy", species: "Dog", breed: "Beagle", age: "6 years", owner: "Robert Brown", lastVisit: "3 days ago" }
  ];
  
  // Fetch vet data on component mount
  useEffect(() => {
    const fetchVetData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login?redirect=/vet-dashboard');
          return;
        }
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login?redirect=/vet-dashboard');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch vet data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.data.role !== 'veterinarian') {
          router.push('/dashboard');
          return;
        }
        
        setVetData(data.data);
      } catch (error) {
        console.error("Error fetching vet data:", error);
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVetData();
  }, [router]);
  
  // Placeholder stats - would be fetched from API
  const dashboardStats = {
    appointmentsToday: 8,
    patientsTotal: 156,
    pendingRequests: 3,
    completionRate: 95
  };

  const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
 
  console.log('Successfully logged out');
  router.push('/login');
};
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-16">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Veterinarian Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Dr. {vetData?.name?.split(' ')[0] || 'Veterinarian'}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => router.push('/appointments/create')}>
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {/* Dashboard Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.appointmentsToday}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.patientsTotal}</div>
                <p className="text-xs text-muted-foreground">
                  +7 new this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Requires your attention
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Upcoming Appointments */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your schedule for today and tomorrow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback>{appointment.petName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.petName}</p>
                          <p className="text-sm text-muted-foreground">Owner: {appointment.ownerName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={appointment.date === "Today" ? "default" : "outline"}>
                          {appointment.date}
                        </Badge>
                        <p className="mt-1 text-sm font-medium">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("appointments")}>
                    View All Appointments <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Patients */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Patients you've recently treated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.species} ({patient.breed})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Age: {patient.age}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Owner: {patient.owner}</p>
                        <p className="text-sm font-medium mt-1">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("patients")}>
                    View All Patients <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Practice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Information</CardTitle>
              <CardDescription>Your professional details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Business Details</h3>
                  <p className="text-sm">Business Name: {vetData?.businessName || 'Not provided'}</p>
                  <p className="text-sm mt-1">License Number: {vetData?.licenseNumber || 'Not provided'}</p>
                  <p className="text-sm mt-1">Specialization: {vetData?.serviceType || 'General Veterinary Medicine'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <p className="text-sm">Email: {vetData?.email}</p>
                  <p className="text-sm mt-1">Phone: {vetData?.phoneNumber || 'Not provided'}</p>
                  <p className="text-sm mt-1">
                    Address: {vetData?.address?.street ? (
                      `${vetData.address.street}, ${vetData.address.city}, ${vetData.address.state} ${vetData.address.zipCode}`
                    ) : 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={() => setActiveTab("profile")}>
                  Edit Profile <Settings className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Appointments</CardTitle>
                <Button size="sm" onClick={() => router.push('/appointments/create')}>
                  <Plus className="mr-2 h-4 w-4" /> New Appointment
                </Button>
              </div>
              <CardDescription>Manage your schedule and patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Full Appointments Calendar</h3>
                <p className="text-muted-foreground mb-4">This section would contain a full calendar view of all appointments</p>
                <Button variant="outline">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Management</CardTitle>
              <CardDescription>Set your working hours and manage time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Availability Calendar</h3>
                <p className="text-muted-foreground mb-4">This section would allow you to set your working hours and break times</p>
                <Button variant="outline">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Patient Records</CardTitle>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Patient
                </Button>
              </div>
              <CardDescription>View and manage patient medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Patient Database</h3>
                <p className="text-muted-foreground mb-4">This section would contain a searchable database of patient records</p>
                <Button variant="outline">Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p>{vetData?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{vetData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p>{vetData?.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Professional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                      <p>{vetData?.businessName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">License Number</p>
                      <p>{vetData?.licenseNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                      <p>{vetData?.serviceType || 'General Veterinary Medicine'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Address</h3>
                {vetData?.address && Object.values(vetData.address).some(v => v) ? (
                  <div>
                    <p>{vetData.address.street}</p>
                    <p>{`${vetData.address.city}, ${vetData.address.state} ${vetData.address.zipCode}`}</p>
                    <p>{vetData.address.country}</p>
                  </div>
                ) : (
                  <p>No address information provided</p>
                )}
              </div>
              
<div className="mt-6 flex flex-wrap gap-4">
  <Button onClick={() => router.push('/profile/edit')}>
    Edit Profile
  </Button>
  <Button variant="outline" onClick={() => router.push('/change-password')}>
    Change Password
  </Button>
  <Button 
    variant="destructive" 
    onClick={handleLogout}
    className="ml-auto"
  >
    Logout
  </Button>
</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}