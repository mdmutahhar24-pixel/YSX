import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Raleway } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Providers from "../providers";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  title: "YSX",
  description: "Social Media Website",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="">
          {children}
          <Toaster position="top-right" richColors closeButton theme="system" toastOptions={{
            className: 'font-mono animate-in fade-in',
            classNames: {
              title: 'font-bold text-xl'
            }
          }} />
        </div>
  );
}