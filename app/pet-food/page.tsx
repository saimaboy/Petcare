"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

// Sample pet food items
const petFoods = [
  {
    id: 1,
    name: "Organic Dog Food - Chicken & Rice",
    description: "High-quality organic food for dogs made with chicken and rice.",
    price: 29.99,
    rating: 4.7,
    image: "https://naturesharvest.co.uk/cdn/shop/files/Chicken-and-Rice-for-dogs---Adult-Dog-Food-100_-Natural-Complete-Meal-edited_1.png?v=1727461799",
  },
  {
    id: 2,
    name: "Premium Cat Food - Salmon",
    description: "Delicious salmon-based food to keep your cat healthy and happy.",
    price: 24.99,
    rating: 4.9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS8EfeKVIlYsjo1UeBjMNh2oSWN5Cf69nvCw&s",
  },
  {
    id: 3,
    name: "Wet Dog Food - Beef & Carrots",
    description: "Tasty and nutritious beef and carrot wet food for dogs.",
    price: 18.99,
    rating: 4.6,
    image: "https://www.nutrish.com/wp-content/uploads/2024/04/Nutrish-Chunks-In-Gravy-Beef-Veggies-Wet-Dog-Food-Can.png",
  },
  {
    id: 4,
    name: "Grain-Free Cat Food - Turkey & Pumpkin",
    description: "Grain-free cat food made with turkey and pumpkin for easy digestion.",
    price: 22.99,
    rating: 4.8,
    image: "https://www.epet.hk/media/catalog/product/cache/9c934f9b7af27c54506ff69e05683bd5/n/u/nutrience_subzero_lid_turkey_pumpkin.jpg",
  },
]

export default function PetFoodPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPetFoods = petFoods.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          filteredPetFoods.map((item) => (
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
          <p className="text-muted-foreground col-span-full text-center">No pet food found.</p>
        )}
      </div>
    </div>
  )
}
