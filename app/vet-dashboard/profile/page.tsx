"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building, Camera, Check, Edit, Mail, MapPin, Phone, Save, User, Plus } from "lucide-react"

// Mock data for veterinarian profile
const profileData = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "(555) 123-4567",
  specialties: ["General Veterinarian", "Dentistry"],
  bio: "Dr. Sarah Johnson is a dedicated veterinarian with over 10 years of experience in small animal medicine. She has a special interest in preventive care and dental health.",
  education: [
    { degree: "Doctor of Veterinary Medicine", institution: "University of Veterinary Sciences", year: "2012" },
    { degree: "Bachelor of Science in Biology", institution: "State University", year: "2008" },
  ],
  certifications: [
    { name: "American Veterinary Dental College (AVDC) Certification", year: "2015" },
    { name: "Advanced Cardiac Life Support for Animals", year: "2017" },
  ],
  clinicInfo: {
    name: "City Pet Hospital",
    address: "123 Main St, City, State 12345",
    phone: "(555) 987-6543",
    website: "www.citypethospital.com",
  },
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(profileData)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingClinic, setIsEditingClinic] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profileData)

  const handlePersonalInfoChange = (field, value) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value,
    })
  }

  const handleClinicInfoChange = (field, value) => {
    setEditedProfile({
      ...editedProfile,
      clinicInfo: {
        ...editedProfile.clinicInfo,
        [field]: value,
      },
    })
  }

  const savePersonalInfo = () => {
    setProfile(editedProfile)
    setIsEditingPersonal(false)
  }

  const saveClinicInfo = () => {
    setProfile(editedProfile)
    setIsEditingClinic(false)
  }

  const cancelPersonalEdit = () => {
    setEditedProfile(profile)
    setIsEditingPersonal(false)
  }

  const cancelClinicEdit = () => {
    setEditedProfile(profile)
    setIsEditingClinic(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your personal and professional information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">Veterinarian</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <div className="w-full space-y-2 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.clinicInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.clinicInfo.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal contact details</CardDescription>
                  </div>
                  {!isEditingPersonal ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingPersonal(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={cancelPersonalEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={savePersonalInfo}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditingPersonal ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditingPersonal ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditingPersonal ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditingPersonal ? (
                        <Textarea
                          id="bio"
                          rows={4}
                          value={editedProfile.bio}
                          onChange={(e) => handlePersonalInfoChange("bio", e.target.value)}
                        />
                      ) : (
                        <div className="rounded-md border px-3 py-2">
                          <p>{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Clinic Information</CardTitle>
                    <CardDescription>Manage your clinic details</CardDescription>
                  </div>
                  {!isEditingClinic ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingClinic(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={cancelClinicEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveClinicInfo}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinic-name">Clinic Name</Label>
                      {isEditingClinic ? (
                        <Input
                          id="clinic-name"
                          value={editedProfile.clinicInfo.name}
                          onChange={(e) => handleClinicInfoChange("name", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.clinicInfo.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-address">Address</Label>
                      {isEditingClinic ? (
                        <Input
                          id="clinic-address"
                          value={editedProfile.clinicInfo.address}
                          onChange={(e) => handleClinicInfoChange("address", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.clinicInfo.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-phone">Clinic Phone</Label>
                      {isEditingClinic ? (
                        <Input
                          id="clinic-phone"
                          value={editedProfile.clinicInfo.phone}
                          onChange={(e) => handleClinicInfoChange("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.clinicInfo.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinic-website">Website</Label>
                      {isEditingClinic ? (
                        <Input
                          id="clinic-website"
                          value={editedProfile.clinicInfo.website}
                          onChange={(e) => handleClinicInfoChange("website", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
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
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                          <span>{profile.clinicInfo.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Info Tab */}
            <TabsContent value="professional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your academic background and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          </div>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Your professional certifications and credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                          </div>
                          <Badge variant="outline">{cert.year}</Badge>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Certification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                  <CardDescription>Your areas of expertise and specialization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-md border px-3 py-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{specialty}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Specialty
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your account password</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Activity</CardTitle>
                  <CardDescription>Monitor your account login activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Last Login</h4>
                          <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
                        </div>
                        <Badge variant="outline">Current Session</Badge>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Previous Login</h4>
                          <p className="text-sm text-muted-foreground">Yesterday, 3:45 PM</p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
