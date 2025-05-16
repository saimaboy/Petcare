import { ShoppingBag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love!
      </p>
      <Button asChild>
        <Link href="/products">Start Shopping</Link>
      </Button>
    </div>
  )
}
