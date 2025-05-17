"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ServiceProviderRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
    serviceType: "veterinarian", // Default value for the service type
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Determine role based on serviceType
      const role = formData.serviceType === 'veterinarian' ? 'veterinarian' : 
                   formData.serviceType === 'pharmacy' ? 'pharmacist' : 'service_provider';
                   
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.businessName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          licenseNumber: formData.licenseNumber,
          serviceType: formData.serviceType,
          password: formData.password,
          role: role // Set role based on the service type
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // On successful registration, redirect to login page
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ form: error.message || "Registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-semibold text-center text-primary">Create a Service Provider Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to register as a service provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yourbusiness@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="(123) 456-7890"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="Your License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="veterinarian">Veterinarian</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="other">Other Pet Service Provider</option>
                </select>
                {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {/* Form Error */}
              {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </div>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </div>
            <div className="text-sm text-center">
              Looking for pet services?{" "}
              <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                Register as a pet owner
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}