import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, Calendar, ShoppingBag, BookOpen, MapPinned } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Complete Pet Care Management in One Place
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find veterinarians, medicines, pet food, and nearby services all in one platform. Manage your pet's
                health with ease.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/find-vet">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Find a Vet
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Pet Care"
                className="rounded-lg object-cover"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to take care of your pet's health and well-being
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Search className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Find a Veterinarian</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Search for veterinarians by location, specialty, and availability. View profiles and book
                  appointments.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/find-vet" className="w-full">
                  <Button variant="outline" className="w-full">
                    Find Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Pet Medicines & Food</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse and purchase medicines, supplements, and food for your pet from verified sources.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/medicines" className="w-full">
                  <Button variant="outline" className="w-full">
                    Shop Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MapPinned className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Nearby Services</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Locate nearby pet pharmacies, hospitals, and other services using our geolocation feature.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/nearby" className="w-full">
                  <Button variant="outline" className="w-full">
                    Find Nearby
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Appointment Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book and manage veterinary appointments online. Receive reminders for upcoming visits.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/appointments" className="w-full">
                  <Button variant="outline" className="w-full">
                    Schedule
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Knowledge Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access articles, care tips, and guidelines on pet health, nutrition, and preventive care.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/knowledge-hub" className="w-full">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <MapPin className="h-8 w-8 text-primary" />
                <div className="grid gap-1">
                  <CardTitle>Pet-Friendly Places</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Discover pet-friendly parks, cafes, and other locations in your area.</CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/pet-friendly" className="w-full">
                  <Button variant="outline" className="w-full">
                    Discover
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Pet Owners Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from pet owners who have used our platform
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="User"
                    className="rounded-full"
                    width={80}
                    height={80}
                  />
                  <div className="space-y-2 text-center">
                    <h3 className="font-bold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">
                      "PetCare has made managing my dog's healthcare so much easier. I can find vets, book appointments,
                      and order medicines all in one place."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="User"
                    className="rounded-full"
                    width={80}
                    height={80}
                  />
                  <div className="space-y-2 text-center">
                    <h3 className="font-bold">Michael Rodriguez</h3>
                    <p className="text-sm text-muted-foreground">
                      "The nearby services feature helped me find an emergency vet clinic when my cat got sick in the
                      middle of the night. Truly a lifesaver!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src="/placeholder.svg?height=100&width=100"
                    alt="User"
                    className="rounded-full"
                    width={80}
                    height={80}
                  />
                  <div className="space-y-2 text-center">
                    <h3 className="font-bold">Emily Chen</h3>
                    <p className="text-sm text-muted-foreground">
                      "I love the knowledge hub articles. They've helped me understand my pet's nutritional needs and
                      improve her diet significantly."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Simplify Pet Care?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of pet owners who are already using our platform to manage their pet's health.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

