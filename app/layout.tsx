import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import  ThemeProvider  from "../components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Fitly - Your AI Powered Fitness System",
  description:
    "Achieve a healthier and more active lifestyle with Fitly's personalized workout plans, nutrition guidance, and progress tracking.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

