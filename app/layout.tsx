import { Analytics } from '@vercel/analytics/react'
import '@/styles/globals.css'
import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Chatbot from '@/components/chatbot'
import { GoogleAnalytics } from '@next/third-parties/google'
import { AOSInit } from '@/components/aos-init'
import { TooltipProvider } from '@/components/ui/tooltip'
import { constructMetadata } from '@/lib/construct-metadata'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = localFont({
  src: "../assets/fonts/Inter-Bold.ttf",
  variable: "--font-heading",
})

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <AOSInit />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster />
            {process.env.VERCEL_ENV === "production" && <Analytics />}
          </TooltipProvider>
        </ThemeProvider>
        <Chatbot />
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID || ''} />
      </body>
    </html>
  );
}
