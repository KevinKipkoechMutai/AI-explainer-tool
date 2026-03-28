import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import { ToastListener } from "@/components/ToastListener";

const ibmPlexSerif = IBM_Plex_Serif({
    variable: "--font-ibm-plex-serif",
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    subsets: ['latin'],
    display: 'swap'
})

export const metadata: Metadata = {
  title: "Bookified",
  description: "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books using voice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans antialiased`}
      >
        <ClerkProvider
            appearance={{
                layout: {
                    logoImageUrl: "/assets/logo.png",
                    socialButtonsVariant: 'blockButton',
                    shimmer: true,
                },
                variables: {
                    colorPrimary: "#212a3b",
                    colorBackground: "#ffffff",
                    colorText: "#212a3b",
                    colorInputBackground: "#ffffff",
                    colorInputText: "#212a3b",
                    borderRadius: "0.625rem",
                },
                elements: {
                    card: "shadow-soft-md border border-border-subtle",
                    headerTitle: "font-serif text-2xl font-bold",
                    headerSubtitle: "font-sans text-muted-foreground",
                    socialButtonsBlockButton: "border-border-medium hover:bg-secondary transition-all",
                    formButtonPrimary: "bg-primary hover:bg-accent-warm-hover text-primary-foreground font-semibold",
                    footerActionLink: "text-primary hover:text-accent-warm-hover font-bold",
                }
            }}
        >
            <Navbar/>
            {children}
            <ToastListener />
        </ClerkProvider>
      <Toaster/>
      </body>
    </html>
  );
}
