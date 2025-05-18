"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Cat, Dog, Rabbit, Bird, Fish, ArrowLeft } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const CATEGORY_MAP = [
  { value: "all", label: "All", icon: BookOpen },
  { value: "Dogs", label: "Dogs", icon: Dog },
  { value: "Cats", label: "Cats", icon: Cat },
  { value: "Small Pets", label: "Small Pets", icon: Rabbit },
  { value: "Birds", label: "Birds", icon: Bird },
  { value: "Fish", label: "Fish", icon: Fish },
]

export default function KnowledgeHub() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/articles`)
        if (!res.ok) throw new Error("Failed to fetch articles")
        const data = await res.json()
        setArticles(data.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load articles")
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  // Show full article if selected
  if (selectedArticle) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4 flex items-center gap-2" onClick={() => setSelectedArticle(null)}>
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Button>
        <Card className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={selectedArticle.image || "/placeholder.svg"}
              alt={selectedArticle.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              {selectedArticle.category}
            </div>
          </div>
          <CardHeader>
            <CardTitle>{selectedArticle.title}</CardTitle>
            <CardDescription>
              {selectedArticle.date
                ? new Date(selectedArticle.date).toLocaleDateString()
                : ""}
              {selectedArticle.readTime ? ` · ${selectedArticle.readTime}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{selectedArticle.excerpt}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content || "" }} />
          </CardContent>
        </Card>
      </div>
    )
  }

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

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {CATEGORY_MAP.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {CATEGORY_MAP.map(({ value, label }) => (
          <TabsContent key={value} value={value}>
            {loading ? (
              <div className="text-center py-12">Loading articles...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(value === "all"
                  ? articles
                  : articles.filter((article) => article.category === label)
                ).length > 0 ? (
                  (value === "all"
                    ? articles
                    : articles.filter((article) => article.category === label)
                  ).map((article) => (
                    <Card key={article._id} className="overflow-hidden">
                      <div className="aspect-video relative">
<img
  src={
    article.image
      ? article.image.startsWith("http")
        ? article.image
        : `http://localhost:5000/${article.image.replace(/^\/+/, "")}`
      : "/placeholder.svg"
  }
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
                          {article.date
                            ? new Date(article.date).toLocaleDateString()
                            : ""}
                          {article.readTime ? ` · ${article.readTime}` : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{article.excerpt}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedArticle(article)}>
                          Read Article
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center">
                    No articles found for {label}.
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        ))}
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