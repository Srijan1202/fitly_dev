"use client"

import Navbar from "@/components/navbar"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function FitlyLandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/images/fitness-1.jpg",
      alt: "Person in workout attire",
    },
    {
      image: "/images/fitness-2.jpg",
      alt: "Person in fitness clothing",
    },
    {
      image: "/images/fitness-3.jpg",
      alt: "Person in athletic wear",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center">
        {/* Slider */}
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-black/10" />
              <img src={slide.image || "/placeholder.svg"} alt={slide.alt} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.h1
              className="font-serif italic text-7xl md:text-9xl mb-2 text-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fitly
            </motion.h1>
            <motion.p
              className="text-gray-800 text-lg md:text-xl mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              An AI Powered Fitness System
            </motion.p>
            <motion.p
              className="text-gray-600 uppercase tracking-widest text-sm md:text-base font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              For your daily wellness needs.
            </motion.p>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm uppercase tracking-wider shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Achieve Your Fitness Goals</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Whether you're a beginner or a fitness enthusiast, Fitly makes your journey simple, effective, and
              enjoyable. Stay motivated, stay fit!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Workouts",
                description: "Custom fitness plans tailored to your goals, fitness level, and preferences.",
                delay: 0.2,
              },
              {
                title: "Nutrition Guidance",
                description: "Expert dietary recommendations to complement your fitness journey.",
                delay: 0.4,
              },
              {
                title: "Progress Tracking",
                description: "Monitor your improvements with detailed analytics and milestone celebrations.",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Fitness Journey Today</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with Fitly's personalized approach to fitness and
              wellness.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm uppercase tracking-wider shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>

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

