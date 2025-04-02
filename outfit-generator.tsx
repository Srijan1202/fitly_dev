"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Send } from "lucide-react"

interface Outfit {
  id: string
  items: string[]
  products: Product[]
}

interface Product {
  id: string
  name: string
  image: string
  price: string
  link: string
  category: string
}

export default function OutfitGenerator() {
  const [prompt, setPrompt] = useState("")
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

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

      // Flatten and deduplicate by category
      const allProducts = productsResults.flatMap((result) => result.products)
      const productsByCategory: Record<string, Product> = {}

      // Keep only one product per category
      allProducts.forEach((product) => {
        if (!productsByCategory[product.category]) {
          productsByCategory[product.category] = product
        }
      })

      const uniqueProducts = Object.values(productsByCategory)

      const newOutfit: Outfit = {
        id: Date.now().toString(),
        items: outfitItems,
        products: uniqueProducts,
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 bg-white/90 z-0">
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative">
              <Image
                src="/images/model-dress.png"
                alt="Model in white dress"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="w-1/2 h-full relative">
              <Image
                src="/images/model-dress.png"
                alt="Model in white dress detail"
                fill
                className="object-cover object-right"
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <header className="relative z-10 p-8 flex justify-between items-center">
          <Link href="/" className="text-gray-800 font-serif italic text-3xl">
            F
          </Link>
          <nav className="flex space-x-8">
            <Link href="/" className="uppercase text-sm tracking-widest font-light">
              HOME
            </Link>
            <Link href="/about" className="uppercase text-sm tracking-widest font-light">
              ABOUT
            </Link>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 -mt-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-light mb-4 tracking-wider uppercase">AI Outfit Generator</h1>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-sm tracking-wide">
              Not sure what to wear? Enter your preferences, and our AI will craft outfit ideas tailored just for you!
            </p>

            <form onSubmit={generateOutfit} className="max-w-2xl mx-auto">
              <div className="flex flex-col space-y-6">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your style preferences..."
                  className="w-full bg-white/80 backdrop-blur-sm border-0 rounded-full py-4 px-6 text-gray-800 focus:outline-none focus:ring-0 shadow-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-[#e9dff4] hover:bg-[#d9c7ed] text-gray-800 px-8 py-3 rounded-full text-sm uppercase tracking-widest font-light mx-auto flex items-center transition-colors duration-300 disabled:opacity-50"
                  disabled={isLoading || !prompt.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Generate Outfit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Mannequin Section */}
      <div className="relative w-full min-h-screen bg-[#f0e6e6]">
        <div className="absolute inset-0">
          <Image src="/images/mannequin.png" alt="Mannequin" fill className="object-contain" />
        </div>

        {/* Results Section */}
        {outfits.length > 0 && (
          <div className="relative z-10 py-16 px-4 md:px-8" ref={resultsRef}>
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-light mb-4 uppercase tracking-wider">
                  Your Outfit Suggestions
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-sm">
                  Here are your personalized outfit recommendations based on your preferences.
                </p>
              </motion.div>

              <div className="space-y-16">
                {outfits.map((outfit, outfitIndex) => (
                  <motion.div
                    key={outfit.id}
                    id={outfit.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: outfitIndex * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <h3 className="text-2xl font-light mb-6 uppercase tracking-wider">Outfit {outfitIndex + 1}</h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {outfit.items.map((item, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            className="bg-[#f7f3fa] text-gray-700 px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {outfit.products.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                          >
                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="block group">
                              <div className="relative pt-[125%] bg-gray-50 overflow-hidden mb-3">
                                {!imageErrors[product.id] ? (
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={() => handleImageError(product.id)}
                                    unoptimized
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
                                    <p className="text-gray-500 text-sm text-center">{product.name}</p>
                                  </div>
                                )}
                              </div>
                              <h5 className="font-light text-sm line-clamp-1 uppercase tracking-wider">
                                {product.name}
                              </h5>
                              <p className="text-gray-700 text-xs mt-1">{product.price}</p>
                            </a>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">© {new Date().getFullYear()} Fitly. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-500 text-xs uppercase tracking-wider hover:text-gray-800">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-500 text-xs uppercase tracking-wider hover:text-gray-800">
              Privacy
            </Link>
            <Link href="/contact" className="text-gray-500 text-xs uppercase tracking-wider hover:text-gray-800">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

