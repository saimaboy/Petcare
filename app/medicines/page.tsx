"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

// Sample pet medicines
const medicines = [
  {
    id: 1,
    name: "Flea and Tick Treatment for Dogs",
    description: "Effective flea and tick treatment to protect your dog from pests.",
    price: 19.99,
    rating: 4.7,
    image: "https://mypets.lk/cdn/shop/files/NexGardFlea_TickTreatmentforMediumDogs.webp?v=1690369074",
  },
  {
    id: 2,
    name: "Ear Infection Medicine for Cats",
    description: "Antibiotic ear drops for treating ear infections in cats.",
    price: 15.99,
    rating: 4.9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRDgaHL7gqZ8vfEABVCotm5eZgmV8OE4LNrw&s",
  },
  {
    id: 3,
    name: "Dog Joint Pain Relief",
    description: "Joint pain relief supplement for older dogs to improve mobility.",
    price: 25.99,
    rating: 4.5,
    image: "https://i5.walmartimages.com/seo/BestLife4Pets-Walk-Easy-Hip-and-Joint-Care-Natural-Supplement-for-Dogs-and-Cats-Anti-Inflammatory-Pills_b7622344-5112-430d-ac57-4d4d18e38d1b.2aabb79a7d960e1452ae88e62a000c21.jpeg",
  },
  {
    id: 4,
    name: "Cat Probiotic Supplement",
    description: "Probiotic supplement to aid digestion and improve gut health in cats.",
    price: 18.99,
    rating: 4.8,
    image: "https://cdn11.bigcommerce.com/s-qa8c8lub49/images/stencil/1280x1280/products/3657/7578/FortiFlora_PRO_feline_1__28706.1720748579.png?c=1",
  },
]

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = medicines.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Medicines</h1>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search Medicines</Label>
        <Input
          id="search"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((item) => (
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
          <p className="text-muted-foreground col-span-full text-center">No medicines found.</p>
        )}
      </div>
    </div>
  )
}
