"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, ShoppingCart, ClipboardList } from "lucide-react" // Added ClipboardList icon
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Home
                </Link>
                <Link
                  href="/find-vet"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/find-vet" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Find a Vet
                </Link>
                <Link
                  href="/medicines"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/medicines" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Medicines
                </Link>
                <Link
                  href="/pet-food"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/pet-food" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Pet Food
                </Link>
                <Link
                  href="/nearby"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/nearby" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Nearby Services
                </Link>
                <Link
                  href="/knowledge-hub"
                  className={cn(
                    "hover:text-foreground/80",
                    pathname === "/knowledge-hub" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Knowledge Hub
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">PetCare</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/find-vet" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Find a Vet</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Pet Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/medicines"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Medicines</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Find pet medicines and supplements
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/pet-food"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Pet Food</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse pet food options for all breeds and ages
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/accessories"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Accessories</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Shop for pet accessories and supplies
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/nearby" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Nearby Services</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/knowledge-hub" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Knowledge Hub</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[300px]"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ClipboardList className="h-5 w-5" />
              <span className="sr-only">Orders</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}