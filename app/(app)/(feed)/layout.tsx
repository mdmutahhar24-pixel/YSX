import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Raleway } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import InteractableButtons from "@/components/InteractableButtons";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <Providers>
          <div className="flex h-full">
            <main className="flex-1 min-w-0 items-center">
              <div className="fixed inset-0 flex justify-center pointer-events-none">
                <div className="w-full max-w-115 pointer-events-auto">
                  {children}
                </div>
              </div>
              
            </main>
          </div>
          <Toaster position="top-right" richColors closeButton theme="system" toastOptions={{
            className: 'font-mono animate-in fade-in',
            classNames: {
              title: 'font-bold text-xl'
            }
          }} />
        </Providers>
  );
}
