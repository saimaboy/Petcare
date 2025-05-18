"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useCart } from "../cart/CartContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function PaymentPage() {
  const { cartItems, clearCart } = useCart()
  const router = useRouter()
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate totals
  const shipping = 9.99
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.07 // 7% tax rate
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const validateCardDetails = () => {
    const { cardNumber, expiry, cvv, cardHolder } = cardDetails
    if (!cardNumber || cardNumber.length < 16) return "Invalid card number"
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return "Invalid expiry date (MM/YY)"
    if (!cvv || cvv.length < 3) return "Invalid CVV"
    if (!cardHolder) return "Cardholder name is required"
    return null
  }

  const handlePayment = async () => {
    setError(null)
    setIsLoading(true)

    // Validate card details
    const validationError = validateCardDetails()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: "completed",
        createdAt: new Date().toISOString(),
        // Add userId if authentication is implemented
      }

      // Save order to database
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) throw new Error("Failed to save order")

      // Clear cart and redirect to success page
      clearCart()
      router.push("/payment/success")
    } catch (err: any) {
      setError(err.message || "Payment processing failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardHolder">Cardholder Name</Label>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="John Doe"
                    value={cardDetails.cardHolder}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
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
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={isLoading || cartItems.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </Button>
    
          </Card>
        </div>
      </div>
    </div>
  )
}