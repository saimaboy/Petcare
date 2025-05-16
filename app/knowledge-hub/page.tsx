import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Cat, Dog, Rabbit, Bird, Fish } from "lucide-react"

// Mock data for articles
const articles = [
  {
    id: 1,
    title: "Essential Vaccinations for Dogs",
    category: "Dogs",
    excerpt:
      "Learn about the core and non-core vaccinations that every dog owner should consider for their pet's health.",
    image: "https://dixhillsanimalhospital.com/wp-content/uploads/2024/01/are-yearly-dog-vaccines-necessary-huntington-ny-scaled.jpeg",
    date: "March 15, 2023",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Feline Nutrition: What Your Cat Really Needs",
    category: "Cats",
    excerpt:
      "Discover the essential nutrients that cats require and how to choose the right food for your feline friend.",
    image: "https://getpets.me/jpg/5904452487476854.jpg?v=1713379316&width=2240",
    date: "April 2, 2023",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Signs of Common Pet Illnesses to Watch For",
    category: "General",
    excerpt:
      "Early detection is key to treating pet illnesses. Learn the warning signs that could indicate your pet is unwell.",
    image: "https://www.everypaw.com/.imaging/mte/everypaw/blog/dam/all-things-pet/10-common-dog-illnesses-and-symptoms/common-dog-illness-symptoms-banner.jpg/jcr:content/common-dog-illness-symptoms-banner.jpg",
    date: "May 10, 2023",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Dental Care for Pets: A Complete Guide",
    category: "General",
    excerpt:
      "Proper dental care is essential for your pet's overall health. Learn how to maintain your pet's oral hygiene.",
    image: "https://langleyanimalclinic.ca/wp-content/uploads/2024/04/Cavities-in-Pets.jpg",
    date: "June 18, 2023",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "Caring for Senior Pets: Special Considerations",
    category: "General",
    excerpt: "As pets age, they require different care. Discover how to keep your senior pet comfortable and healthy.",
    image: "https://media.licdn.com/dms/image/v2/D5612AQH2M065Nm5X7w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1689873982523?e=2147483647&v=beta&t=pYA_f58nE6FySnxngZrUQUgnS-Yc8lY9lo38WRcKy5I",
    date: "July 5, 2023",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Small Pets: Proper Care for Rabbits and Guinea Pigs",
    category: "Small Pets",
    excerpt:
      "Learn about the specific needs of small pets like rabbits and guinea pigs to ensure they thrive in your care.",
    image: "https://www.arkanimalhospital.net/blog/wp-content/uploads/2023/10/iStock-628163154-1-2000x1333.jpg",
    date: "August 22, 2023",
    readTime: "5 min read",
  },
]

export default function KnowledgeHub() {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pet Care Knowledge Hub</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover articles, guides, and resources to help you take better care of your pets
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="dogs" className="flex items-center gap-2">
              <Dog className="h-4 w-4" />
              <span className="hidden md:inline">Dogs</span>
            </TabsTrigger>
            <TabsTrigger value="cats" className="flex items-center gap-2">
              <Cat className="h-4 w-4" />
              <span className="hidden md:inline">Cats</span>
            </TabsTrigger>
            <TabsTrigger value="small-pets" className="flex items-center gap-2">
              <Rabbit className="h-4 w-4" />
              <span className="hidden md:inline">Small Pets</span>
            </TabsTrigger>
            <TabsTrigger value="birds" className="flex items-center gap-2">
              <Bird className="h-4 w-4" />
              <span className="hidden md:inline">Birds</span>
            </TabsTrigger>
            <TabsTrigger value="fish" className="flex items-center gap-2">
              <Fish className="h-4 w-4" />
              <span className="hidden md:inline">Fish</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    {article.category}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>
                    {article.date} · {article.readTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/knowledge-hub/article/${article.id}`}>Read Article</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dogs">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((article) => article.category === "Dogs")
              .map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {article.category}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>
                      {article.date} · {article.readTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/knowledge-hub/article/${article.id}`}>Read Article</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cats">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((article) => article.category === "Cats")
              .map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {article.category}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>
                      {article.date} · {article.readTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/knowledge-hub/article/${article.id}`}>Read Article</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Similar TabsContent for other pet categories */}
      </Tabs>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <p className="text-muted-foreground mb-6">
          Our veterinary experts are here to help with any specific questions about your pet's health.
        </p>
        <Button asChild>
          <Link href="/contact">Ask a Vet</Link>
        </Button>
      </div>
    </div>
  )
}

