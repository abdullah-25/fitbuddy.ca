import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "../components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
