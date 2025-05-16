import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Package } from "lucide-react"
import Link from "next/link"

export default function OrderHistory() {
  // Mock order data - would come from your database
  const orders = [
    {
      id: "ORD-12345",
      date: "March 15, 2023",
      total: "$249.98",
      status: "Delivered",
      items: [
        { name: "Leather Backpack", quantity: 1, price: "$129.99" },
        { name: "Wireless Headphones", quantity: 1, price: "$89.99" },
      ],
    },
    {
      id: "ORD-12344",
      date: "February 28, 2023",
      total: "$199.99",
      status: "Delivered",
      items: [{ name: "Smart Watch", quantity: 1, price: "$199.99" }],
    },
    {
      id: "ORD-12343",
      date: "January 15, 2023",
      total: "$59.99",
      status: "Delivered",
      items: [
        { name: "Phone Case", quantity: 1, price: "$29.99" },
        { name: "Screen Protector", quantity: 1, price: "$15.00" },
        { name: "USB-C Cable", quantity: 1, price: "$15.00" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track your recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-6">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">When you place an order, it will appear here.</p>
              <Button className="mt-4" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={order.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <Badge variant={order.status === "Delivered" ? "outline" : "default"}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{order.total}</p>
                      <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                        <Link href={`/orders/${order.id}`}>
                          Details
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <ul className="space-y-1">
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < orders.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
