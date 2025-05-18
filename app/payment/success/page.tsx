"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase! Your order has been successfully placed and saved.
          </p>
          <p className="text-muted-foreground">
            You will receive a confirmation email with your order details shortly.
          </p>
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}