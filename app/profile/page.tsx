"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, MapPin, Phone, Mail, Building, Award } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Debugging helper
  const debugToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found:', token.substring(0, 20) + '...');
      try {
        // Decode the token (client-side only, not secure verification)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        console.log('Token payload:', payload);
        console.log('Expiry:', new Date(payload.exp * 1000).toLocaleString());
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    } else {
      console.log('No token found');
    }
  };

  // Call debug function
  useEffect(() => {
    debugToken();
  }, []);

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
                  <p className="text-lg capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
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