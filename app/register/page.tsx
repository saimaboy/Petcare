"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to name to match backend
    email: "",
    phoneNumber: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
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
      // Use the full URL to your Express backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name, // Send name not fullName
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: 'user' // Set role as user for client registration
        }),
        credentials: 'include', // Important for cookies if you're using them
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store token in localStorage if your app uses it
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      // On successful registration, redirect to login page or dashboard
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
            <CardTitle className="text-3xl font-semibold text-center text-primary">Create an Account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to register as a pet owner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-2 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
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
              Are you a service provider?{" "}
              <Link href="/serviceproviderregister" className="underline underline-offset-4 hover:text-primary">
                Register as a service provider
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}