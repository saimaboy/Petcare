"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function PetFoodPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [petFoods, setPetFoods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPetFoods = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Fetch all products with category=petfood
        const res = await fetch(`${API_URL}/products?category=petfood`)
        if (!res.ok) throw new Error("Failed to fetch pet food")
        const data = await res.json()
        // Filter on frontend as fallback if backend doesn't support ?category=petfood
        const filtered = (data.data || []).filter((item: any) => item.category === "petfood")
        setPetFoods(filtered)
      } catch (err: any) {
        setError(err.message || "Failed to load pet food")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPetFoods()
  }, [])

  const filteredPetFoods = petFoods.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading pet food...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Food</h1>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search Pet Food</Label>
        <Input
          id="search"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPetFoods.length > 0 ? (
          filteredPetFoods.map((item: any) => (
            <Card key={item._id} className="flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-md" />
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating ? item.rating : "4.5"}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold text-lg">${item.price?.toFixed(2)}</span>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">No pet food found.</p>
        )}
      </div>
    </div>
  )
}