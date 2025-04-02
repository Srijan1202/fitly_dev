"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")
  const [year, setYear] = useState("")

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscriptionStatus("success")
    setEmail("")
  }

  return (
    <footer className="bg-[#1C1C1C] text-white rounded-t-3xl mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-2">Fitly</h2>
            <p className="text-gray-400 mb-4">Your AI Wardrobe Assistant</p>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/overview" className="text-gray-400 hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/technology" className="text-gray-400 hover:text-white transition-colors">Technology</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About us</Link></li>
              <li><Link href="https://medium.com/@fitlyapp25" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Fitly</li>
              <li className="text-gray-400">fitlyapp25@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-xl">
            <h3 className="text-xl mb-4">Stay up to date with Fitly</h3>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail"
                className="flex-1 bg-transparent border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black px-6 py-2 rounded-md font-medium"
                type="submit"
              >
                Submit
              </motion.button>
            </form>
            {subscriptionStatus === "success" && (
              <p className="text-green-500 mt-2">Thank you for subscribing!</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              By subscribing you agree to our Privacy Policy and provide consent to receive updates from our company.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {year} Fitly. All rights reserved
          </p>
          <div className="flex space-x-6"></div>
        </div>
      </div>
    </footer>
  )
}