"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, MapPin, Phone, Mail, Building, Award, Camera, X, Edit, LogOut, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Add a timestamp to force image refresh when updated
  const [imageTimestamp, setImageTimestamp] = useState(Date.now())

  // Add edit mode state
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    businessName: '',
    licenseNumber: '',
    serviceType: ''
  })

  // Fetch user data on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.log('No auth token found, redirecting to login');
          router.push('/login?redirect=/profile');
          return;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          console.log('Auth token expired or invalid, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login?redirect=/profile');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error('Invalid response format from server');
        }

        setUser(data.data);
        setFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phoneNumber: data.data.phoneNumber || '',
          address: {
            street: data.data.address?.street || '',
            city: data.data.address?.city || '',
            state: data.data.address?.state || '',
            zipCode: data.data.address?.zipCode || '',
            country: data.data.address?.country || ''
          },
          businessName: data.data.businessName || '',
          licenseNumber: data.data.licenseNumber || '',
          serviceType: data.data.serviceType || ''
        });

        if (data.data.profileImage) {
          setProfileImage(data.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile data. Please try again later.");
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login?redirect=/profile');
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      },
      businessName: user?.businessName || '',
      licenseNumber: user?.licenseNumber || '',
      serviceType: user?.serviceType || ''
    });
    setIsEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log("Form data being sent:", formData);

      const response = await fetch(`${API_URL}/auth/updateprofile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      setUser(result.data);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, or GIF images are allowed.';
    }
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB.';
    }
    return null;
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append('profileImage', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload profile image: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.profileImage) {
        setImageTimestamp(Date.now());
        setProfileImage(result.profileImage);
        setUser(prev => ({
          ...prev,
          profileImage: result.profileImage
        }));
        setImagePreview(null); // Clear preview after successful upload
        alert('Profile image uploaded successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert(`Failed to upload profile image: ${error.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-primary');

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append('profileImage', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/users/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload profile image: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.profileImage) {
        setImageTimestamp(Date.now());
        setProfileImage(result.profileImage);
        setUser(prev => ({
          ...prev,
          profileImage: result.profileImage
        }));
        setImagePreview(null);
        alert('Profile image uploaded successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert(`Failed to upload profile image: ${error.message}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('border-primary');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-primary');
  };

  const removeProfileImage = async () => {
    try {
      setIsUploadingImage(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

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

      setProfileImage(null);
      setImagePreview(null);
      setUser(prev => ({
        ...prev,
        profileImage: null
      }));
      alert('Profile image removed successfully!');
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('Failed to remove profile image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const cancelImagePreview = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
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
          <div className="flex gap-3">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <Button onClick={handleEditProfile}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Image Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                ref={dropZoneRef}
                className="relative w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors"
                onClick={handleProfileImageClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Avatar className="h-28 w-28">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Preview" />
                  ) : profileImage ? (
                    <AvatarImage 
                      src={`${profileImage}?t=${imageTimestamp}`} 
                      alt={user?.name} 
                    />
                  ) : (
                    <AvatarFallback className="text-4xl bg-primary/10">
                      {user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleProfileImageChange}
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button 
                    size="sm" 
                    onClick={handleProfileImageClick}
                    disabled={isUploadingImage}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {profileImage ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {(profileImage || imagePreview) && (
                    <>
                      {imagePreview ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={cancelImagePreview}
                          disabled={isUploadingImage}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Preview
                        </Button>
                      ) : (
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
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload a clear photo. <br />
                  JPEG, PNG, or GIF, max 5MB, recommended 500x500 pixels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isEditMode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Your Profile
              </CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  You can update your personal information, address details, and professional information if applicable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleEditProfile}>
                    Edit Personal Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              {isEditMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      placeholder="Your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              ) : (
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
              )}
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
              {isEditMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Textarea 
                      id="street" 
                      name="address.street" 
                      value={formData.address.street} 
                      onChange={handleInputChange}
                      placeholder="Street address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        name="address.city" 
                        value={formData.address.city} 
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        name="address.state" 
                        value={formData.address.state} 
                        onChange={handleInputChange}
                        placeholder="State or Province"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal/ZIP Code</Label>
                      <Input 
                        id="zipCode" 
                        name="address.zipCode" 
                        value={formData.address.zipCode} 
                        onChange={handleInputChange}
                        placeholder="Postal or ZIP code"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        name="address.country" 
                        value={formData.address.country} 
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                user?.address && Object.values(user.address).some(value => value) ? (
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

          {(user?.role === 'veterinarian' || user?.role === 'pharmacist' || 
            formData.businessName || formData.licenseNumber || formData.serviceType) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" /> 
                  Business Information
                </CardTitle>
                <CardDescription>Your professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditMode ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName" 
                        name="businessName" 
                        value={formData.businessName} 
                        onChange={handleInputChange}
                        placeholder="Your business or practice name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input 
                        id="licenseNumber" 
                        name="licenseNumber" 
                        value={formData.licenseNumber} 
                        onChange={handleInputChange}
                        placeholder="Your professional license number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Input 
                        id="serviceType" 
                        name="serviceType" 
                        value={formData.serviceType} 
                        onChange={handleInputChange}
                        placeholder="Type of service provided"
                      />
                    </div>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {isEditMode && (
          <div className="mt-8 flex justify-end">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}