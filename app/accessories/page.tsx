"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

// Sample accessory items
const accessories = [
  {
    id: 1,
    name: "Pet Collar - Adjustable",
    description: "Comfortable and durable collar for pets of all sizes.",
    price: 12.99,
    rating: 4.5,
    image: "https://tudo.lk/uploads/2025/03/thumb/17421339579665282-300x300.webp",
  },
  {
    id: 2,
    name: "Chew Toy - Rubber Bone",
    description: "Safe chew toy for dogs to help reduce anxiety and boredom.",
    price: 7.99,
    rating: 4.8,
    image: "https://allforpets.lk/wp-content/uploads/2021/04/TPR-Bone-Toy.jpg",
  },
  {
    id: 3,
    name: "Cat Scratching Post",
    description: "Tall and sturdy post for cats to scratch and play.",
    price: 29.99,
    rating: 4.6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo4Rz-4fPoJBDTsD6ai0kUyyv_ujCuqnspAA&s",
  },
  {
    id: 4,
    name: "Pet Travel Carrier",
    description: "Lightweight and secure carrier for travel.",
    price: 49.99,
    rating: 4.9,
    image: "https://allforpets.lk/wp-content/uploads/2022/02/soft-sided-airline-approved-travel-dog-cat-carrier-1200x1200.jpg",
  },
]

export default function AccessoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAccessories = accessories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Accessories</h1>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search Accessories</Label>
        <Input
          id="search"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccessories.length > 0 ? (
          filteredAccessories.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-md" />
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="font-semibold text-lg">${item.price.toFixed(2)}</span>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">No accessories found.</p>
        )}
      </div>
    </div>
  )
}
