"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Upload } from "lucide-react"

export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data - would come from your database
  const user = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, CA 12345",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe-0y-a0QHdZ23Kg2ya9ME7hVPyMr7V_-Ipw&s",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile picture</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload new picture</span>
              </Button>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">Member since January 2023</p>
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled={!isEditing} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={user.phone} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={user.address} disabled={!isEditing} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
          {isEditing && <Button onClick={() => setIsEditing(false)}>Save Changes</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}
