"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Blurred and translucent */}
        <div
          className={`flex items-center gap-6 px-6 py-2 rounded-lg backdrop-blur-md ${scrolled ? "bg-white/70" : "bg-white/50"} transition-all duration-300`}
        >
          <Link href="/" className="font-bold text-xl flex items-center">
            <span className="bg-primary text-white p-1 rounded mr-1">F</span>
            Fitly
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-medium hover:text-primary transition-colors">
              Link1
            </Link>
            <Link href="/workouts" className="font-medium hover:text-primary transition-colors">
              Link2
            </Link>
            <Link href="/nutrition" className="font-medium hover:text-primary transition-colors">
              Link3
            </Link>
          </nav>

          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Right side - Opaque with solid color */}
        {/* <div className="bg-gray-100 rounded-full px-1 py-1"> */}
          <LoginButton />
        {/* </div> */}
      </div>
    </header>
  )

}

function LoginButton() {
  return (
    <button className="relative overflow-hidden rounded-full px-6 py-2 bg-black text-white font-medium group">
      <span className="relative z-10 transition-colors group-hover:text-black">Login / Sign Up</span>
      <span className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-100 group-hover:w-full group-hover:h-full transition-all origin-center"></span>
    </button>
  );
}
