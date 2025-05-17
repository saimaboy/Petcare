"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, MapPin, Phone, Mail, Building, Award, Camera, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Fetch user data on component mount
  useEffect(() => {
    // Check if running in browser environment
    if (typeof window === 'undefined') return;
    
    const fetchUserData = async () => {
      try {
        // Try to get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No auth token found, redirecting to login');
          router.push('/login?redirect=/profile');
          return;
        }
        
        console.log('Attempting to fetch user data with token');
        
        // Try to fetch the user data
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        // Handle unauthorized response
        if (response.status === 401) {
          console.log('Auth token expired or invalid, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login?redirect=/profile');
          return;
        }
        
        // Handle other errors
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        
        // Parse and use the data
        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error('Invalid response format from server');
        }
        
        console.log('User data retrieved successfully');
        setUser(data.data);
        
        // Set profile image if available
        if (data.data.profileImage) {
          setProfileImage(data.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
        
        // If there's an error fetching data, we might need to redirect to login
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login?redirect=/profile');
        }, 3000); // Show error message for 3 seconds before redirecting
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Upload image
      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload profile image');
      }
      
      const result = await response.json();
      
      if (result.success && result.profileImage) {
        setProfileImage(result.profileImage);
        
        // Update user object with new profile image
        setUser(prev => ({
          ...prev,
          profileImage: result.profileImage
        }));
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload profile image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      setIsUploadingImage(true);
      
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Remove image
      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove profile image');
      }
      
      // Clear profile image
      setProfileImage(null);
      
      // Update user object
      setUser(prev => ({
        ...prev,
        profileImage: null
      }));
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Button onClick={handleEditProfile}>Edit Profile</Button>
        </div>
        
        {/* New Profile Image Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer" onClick={handleProfileImageClick}>
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={user?.name} />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary/10">
                      {user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleProfileImageChange}
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex gap-2 mb-2">
                  <Button 
                    size="sm" 
                    onClick={handleProfileImageClick}
                    disabled={isUploadingImage}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {profileImage ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {profileImage && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={removeProfileImage}
                      disabled={isUploadingImage}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of yourself. <br />
                  Recommended size: 500x500 pixels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> 
                Personal Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-lg">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{user?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg">{user?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.role === 'veterinarian' ? 'default' : 'outline'}>
                      {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'User'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Rest of your cards remain the same */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> 
                Address Information
              </CardTitle>
              <CardDescription>Your location details</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.address && (
                Object.values(user.address).some(value => value) ? (
                  <div className="space-y-1">
                    {user.address.street && <p>{user.address.street}</p>}
                    <p>
                      {[
                        user.address.city, 
                        user.address.state, 
                        user.address.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                    {user.address.country && <p>{user.address.country}</p>}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No address information provided</p>
                )
              )}
            </CardContent>
          </Card>
          
          {(user?.role === 'veterinarian' || user?.role === 'pharmacist') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" /> 
                  Business Information
                </CardTitle>
                <CardDescription>Your professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                    <p className="text-lg">{user?.businessName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Number</p>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg">{user?.licenseNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                    <p className="text-lg capitalize">{user?.serviceType || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}