"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, RefreshCw, Send, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface Outfit {
  id: string
  items: string[]
  products: Product[]
}

interface Product {
  id: string
  name: string
  image: string
  imageUrl?: string
  price: string
  link: string
}

export default function OutfitGenerator() {
  const [prompt, setPrompt] = useState("")
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingMore, setIsGeneratingMore] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const generateOutfit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      // Get outfit suggestions from ChatGPT
      const response = await fetch("/api/outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) throw new Error("Failed to generate outfit")

      const data = await response.json()
      const outfitItems = data.outfit.split(",").map((item: string) => item.trim())

      // Get product recommendations for each item
      const productsPromises = outfitItems.map((item: string) =>
        fetch("/api/asos-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: item }),
        }).then((res) => res.json()),
      )

      const productsResults = await Promise.all(productsPromises)
      const products = productsResults.flatMap((result) => result.products)

      const newOutfit: Outfit = {
        id: Date.now().toString(),
        items: outfitItems,
        products,
      }

      setOutfits((prev) => [...prev, newOutfit])

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error generating outfit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMoreOutfits = async () => {
    if (!prompt.trim()) return

    setIsGeneratingMore(true)
    try {
      const response = await fetch("/api/outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          previousOutfits: outfits.map((outfit) => outfit.items.join(", ")),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate more outfits")

      const data = await response.json()
      const outfitItems = data.outfit.split(",").map((item: string) => item.trim())

      // Get product recommendations for each item
      const productsPromises = outfitItems.map((item: string) =>
        fetch("/api/amazon-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: item }),
        }).then((res) => res.json()),
      )

      const productsResults = await Promise.all(productsPromises)
      const products = productsResults.flatMap((result) => result.products)

      const newOutfit: Outfit = {
        id: Date.now().toString(),
        items: outfitItems,
        products,
      }

      setOutfits((prev) => [...prev, newOutfit])

      // Scroll to the new outfit
      setTimeout(() => {
        document.getElementById(newOutfit.id)?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error generating more outfits:", error)
    } finally {
      setIsGeneratingMore(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 md:p-6 bg-white shadow-sm">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-gray-800 font-serif italic text-2xl">
            F
          </Link>
          <Link href="/about" className="text-gray-800 uppercase text-sm tracking-wider">
            About
          </Link>
          <Link href="/programs" className="text-gray-800 uppercase text-sm tracking-wider">
            Programs
          </Link>
          <Link href="/outfit-generator" className="text-blue-600 uppercase text-sm tracking-wider font-medium">
            Outfit Generator
          </Link>
        </div>
        <Link href="/login" className="bg-black text-white px-6 py-2 rounded-full text-sm uppercase tracking-wider">
          Login
        </Link>
      </nav>
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className=" text-4xl md:text-5xl font-bold mb-4 text-black">AI Outfit Generator</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Describe your style preferences, occasion, or any specific items you`&apos;`d like to wear, and our AI will
            generate personalized outfit recommendations.
          </p>

          <form onSubmit={generateOutfit} className="max-w-2xl mx-auto">
            <div className="flex flex-col space-y-4 ">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I need a casual outfit for a coffee date on a cool autumn day. I prefer earth tones and comfortable clothes."
                className="min-h-[120px]  p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm uppercase tracking-wider shadow-lg self-center"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Outfit
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </section>
      {/* Results Section */}
      {outfits.length > 0 && (
        <section className="py-16 px-4 md:px-8" ref={resultsRef}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Outfit Suggestions</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Here are your personalized outfit recommendations based on your preferences.
              </p>

              {outfits.length > 0 && (
                <Button
                  onClick={generateMoreOutfits}
                  className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-full text-sm uppercase tracking-wider"
                  disabled={isGeneratingMore}
                >
                  {isGeneratingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating more...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate More Looks
                    </>
                  )}
                </Button>
              )}
            </motion.div>

            <div className="space-y-16">
              <AnimatePresence>
                {outfits.map((outfit, outfitIndex) => (
                  <motion.div
                    key={outfit.id}
                    id={outfit.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: outfitIndex * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold mb-4">Outfit {outfitIndex + 1}</h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {outfit.items.map((item, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>

                      <h4 className="text-xl font-semibold mb-4 flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5 text-blue-600" />
                        Recommended Products
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {outfit.products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                          >
                            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 text-gray-800">
                              <CardContent className="p-0 flex flex-col h-full">
                                <div className="relative pt-[100%] bg-gray-100">
                                  <Image
                                    src={product.image || "/placeholder.svg?height=400&width=300"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                  <h5 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h5>
                                  <p className="text-blue-600 font-bold mt-auto">{product.price}</p>
                                  <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-xs bg-gray-800 text-white py-1 px-3 rounded-full inline-flex items-center justify-center hover:bg-gray-900 transition-colors"
                                  >
                                    View on Asos
                                  </a>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}
      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Fitly. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-800">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-500 text-sm hover:text-gray-800">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-500 text-sm hover:text-gray-800">
              Contact
            </Link>
          </div>
        </div>
      </footer>
          
    </div>
  )
}

