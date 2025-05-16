import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import EmptyCart from "./empty-cart"

export default function CartPage() {
  // This would typically come from a database or state management
  const cartItems = [
    {
      id: 1,
      name: "Chew Toy - Rubber Bone",
      price: 129.99,
      quantity: 1,
      image: "https://allforpets.lk/wp-content/uploads/2021/04/TPR-Bone-Toy.jpg",
    },
    {
      id: 2,
      name: "Cat Scratching Post",
      price: 89.99,
      quantity: 2,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo4Rz-4fPoJBDTsD6ai0kUyyv_ujCuqnspAA&s",
    },
    {
      id: 3,
      name: "Pet Travel Carrier",
      price: 199.99,
      quantity: 1,
      image: "https://allforpets.lk/wp-content/uploads/2022/02/soft-sided-airline-approved-travel-dog-cat-carrier-1200x1200.jpg",
    },
  ]

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 9.99
  const tax = subtotal * 0.07 // 7% tax rate
  const total = subtotal + shipping + tax

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Unit Price: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <Input type="number" min="1" value={item.quantity} className="h-8 w-16 text-center" readOnly />
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="ghost">Update Cart</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
