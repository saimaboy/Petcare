"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Settings, Plus, ArrowRight, CheckCircle, AlertCircle, Loader2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VetDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [vetData, setVetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Appointments state
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  // Article state
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [myArticles, setMyArticles] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: ""
  });

  const recentPatients = [
    { id: "101", name: "Max", species: "Dog", breed: "Golden Retriever", age: "4 years", owner: "John Doe", lastVisit: "Today" },
    { id: "102", name: "Whiskers", species: "Cat", breed: "Siamese", age: "2 years", owner: "Lisa Chen", lastVisit: "Yesterday" },
    { id: "103", name: "Daisy", species: "Dog", breed: "Beagle", age: "6 years", owner: "Robert Brown", lastVisit: "3 days ago" }
  ];

  // Fetch vet data and articles
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
        // Fetch articles authored by this vet
        fetchMyArticles(token, data.data._id);
      } catch (error) {
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVetData();
  }, [router]);

  const fetchMyArticles = async (token: string, vetId: string) => {
    try {
      const res = await fetch(`${API_URL}/articles`);
      const data = await res.json();
      setMyArticles((data.data || []).filter((a: any) => {
        if (!a.author) return false;
        if (typeof a.author === "string") return a.author === vetId;
        if (typeof a.author === "object" && a.author._id) return a.author._id === vetId;
        return false;
      }));
    } catch {
      setMyArticles([]);
    }
  };

  // Fetch appointments for vet
  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments/vet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setUpcomingAppointments(data.data || []);
    } catch (err: any) {
      setAppointmentsError(err.message || "Failed to load appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Article form handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddArticle = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setArticleError(null);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("title", newArticle.title);
      formData.append("category", newArticle.category);
      formData.append("excerpt", newArticle.excerpt);
      formData.append("content", newArticle.content);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Do NOT set Content-Type for FormData!
        },
        body: formData
      });
      if (!res.ok) throw new Error("Failed to add article");
      const data = await res.json();
      setMyArticles([data.data, ...myArticles]);
      setShowArticleForm(false);
      setNewArticle({ title: "", category: "", excerpt: "", content: "", image: "" });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err: any) {
      setArticleError(err.message || "Failed to add article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArticleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewArticle({
      ...newArticle,
      [e.target.name]: e.target.value,
    });
  };

  const dashboardStats = {
    appointmentsToday: 8,
    patientsTotal: 156,
    pendingRequests: 3,
    completionRate: 95
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  // Handle appointment acceptance or rejection
  const handleAppointmentAction = async (appointmentId: string, action: "completed" | "cancelled") => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update appointment: ${res.status} - ${errorText}`);
      }

      // Refresh appointments after successful update
      await fetchAppointments();
    } catch (err: any) {
      setAppointmentsError(err.message || "Failed to update appointment status");
    } finally {
      setIsSubmitting(false);
    }
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
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="articles">
            <BookOpen className="mr-2 h-4 w-4" /> Knowledge Hub
          </TabsTrigger>
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
                {appointmentsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : appointmentsError ? (
                  <div className="text-center text-red-500 py-4">{appointmentsError}</div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <div className="text-muted-foreground text-center">No upcoming appointments.</div>
                    ) : (
                      upcomingAppointments.map((appointment) => (
                        <div key={appointment._id} className="flex flex-col md:flex-row items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-10 w-10 border">
                              <AvatarFallback>
                                {appointment.petName ? appointment.petName.charAt(0) : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{appointment.petName || "Pet"}</p>
                              <p className="text-sm text-muted-foreground">
                                Owner: {appointment.ownerName || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.reason || ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <Badge variant={appointment.date === "Today" ? "default" : "outline"} className="mb-2">
                              {appointment.date || appointment.appointmentDate}
                            </Badge>
                            <p className="text-sm font-medium">{appointment.time || ""}</p>
                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-2 justify-end">
                              {appointment.status === "scheduled" ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleAppointmentAction(appointment._id, "completed")}
                                    disabled={isSubmitting}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleAppointmentAction(appointment._id, "cancelled")}
                                    disabled={isSubmitting}
                                  >
                                    <AlertCircle className="h-4 w-4 mr-1" /> Decline
                                  </Button>
                                </>
                              ) : (
                                <Badge
                                  variant={appointment.status === "completed" ? "default" : "destructive"}
                                  className="mt-2"
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
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
              {appointmentsLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading appointments...
                </div>
              ) : appointmentsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{appointmentsError}</AlertDescription>
                </Alert>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-muted-foreground text-center py-4">
                  No appointments found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                          <TableCell className="font-medium">
                            {appointment.petName || "Pet"}
                          </TableCell>
                          <TableCell>
                            {appointment.ownerName || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {appointment.reason || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={appointment.date === "Today" ? "default" : "outline"}>
                              {appointment.date || appointment.appointmentDate}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {appointment.time || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={appointment.status === "completed" ? "default" : appointment.status === "scheduled" ? "outline" : "destructive"}
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {appointment.status === "scheduled" ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleAppointmentAction(appointment._id, "completed")}
                                  disabled={isSubmitting}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Accept
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleAppointmentAction(appointment._id, "cancelled")}
                                  disabled={isSubmitting}
                                >
                                  <AlertCircle className="h-4 w-4 mr-1" /> Decline
                                </Button>
                              </div>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Knowledge Hub: Your Articles</CardTitle>
                <Button size="sm" onClick={() => setShowArticleForm(!showArticleForm)}>
                  <Plus className="mr-2 h-4 w-4" /> {showArticleForm ? "Cancel" : "Add Article"}
                </Button>
              </div>
              <CardDescription>
                Share your expertise with pet owners by publishing articles to the Knowledge Hub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showArticleForm && (
                <form onSubmit={handleAddArticle} className="space-y-3 mb-6" encType="multipart/form-data">
                  <Input
                    name="title"
                    placeholder="Title"
                    value={newArticle.title}
                    onChange={handleArticleInput}
                    required
                  />
                  <select
                    name="category"
                    value={newArticle.category}
                    onChange={handleArticleInput}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Category</option>
                    <option value="Cats">Cats</option>
                    <option value="Small Pets">Small Pets</option>
                    <option value="Dogs">Dogs</option>
                    <option value="Birds">Birds</option>
                    <option value="Fish">Fish</option>
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    name="excerpt"
                    placeholder="Short Excerpt"
                    value={newArticle.excerpt}
                    onChange={handleArticleInput}
                    required
                  />
                  <textarea
                    name="content"
                    placeholder="Full Article Content"
                    value={newArticle.content}
                    onChange={handleArticleInput}
                    required
                    className="w-full min-h-[100px] border rounded p-2"
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Article"}
                  </Button>
                  {articleError && <div className="text-red-500">{articleError}</div>}
                </form>
              )}

              <div>
                {myArticles.length === 0 ? (
                  <p className="text-muted-foreground">You haven't published any articles yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {[...myArticles]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((article) => (
                        <Card key={article._id}>
                          <div className="flex flex-col md:flex-row">
                            {article.image && (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full md:w-48 h-32 object-cover rounded-l"
                              />
                            )}
                            <div className="flex-1 p-4">
                              <h3 className="font-semibold text-lg">{article.title}</h3>
                              <p className="text-sm text-muted-foreground">{article.category}</p>
                              <p className="mt-2">{article.excerpt}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Published: {new Date(article.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}