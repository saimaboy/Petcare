"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loggedInUserId, setLoggedInUserId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = localStorage.getItem('token') // Adjust based on your token storage
        if (!token) {
          setError("Please log in to view your orders")
          setIsLoading(false)
          return
        }

        // Fetch logged-in user ID
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!userRes.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await userRes.json()
        if (!userData.success) {
          throw new Error(userData.error || "Failed to fetch user data")
        }
        setLoggedInUserId(userData.data.id)

        // Fetch orders
        const ordersRes = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!ordersRes.ok) {
          throw new Error("Failed to fetch orders")
        }
        const ordersData = await ordersRes.json()
        // Verify orders match logged-in user ID
        const filteredOrders = ordersData.orders.filter(
          (order) => order.userId === userData.data.id
        )
        setOrders(filteredOrders)
      } catch (err) {
        setError(err.message || "Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w- shivering animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {error.includes("log in") && (
          <Button className="mt-4" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        )}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            <Button className="mt-4" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Logged-in User ID: {loggedInUserId || "Not available"}
      </p>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
              <p className="text-sm text-muted-foreground">
                User ID: {order.userId}
              </p>
              <p className="text-sm text-muted-foreground">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Status: {order.status}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Unit Price: ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}