import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Raleway } from "next/font/google";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";

const ralewayHeading = Raleway({subsets:['latin'],variable:'--font-heading'});

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", ralewayHeading.variable, nunitoSans.variable, "font-sans", nunitoSans.variable, ralewayHeading.variable)}
    >
      <body>{children}</body>
    </html>
  );
}