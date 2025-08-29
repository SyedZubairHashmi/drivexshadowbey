import type React from "react"
import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const raleway = Raleway({ 
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap"
})

export const metadata: Metadata = {
  title: "DriveX - Car Auction Management",
  description: "Professional car auction management dashboard",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className={`${inter.className} ${raleway.variable}`}>{children}</body>
    </html>
  )
}
