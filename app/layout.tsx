import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { AppProvider } from "../contexts/AppContext"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "RecruitAI - Asistente de Selección de Personal",
  description: "Plataforma de reclutamiento inteligente con evaluación automática de candidatos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={dmSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
