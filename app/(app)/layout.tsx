import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Raleway } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Providers from "../providers";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth/server";
import { syncUser } from "@/lib/dbUserSync";
import { TooltipProvider } from "@/components/ui/tooltip";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase/messaging";
import { prisma } from "@/lib/prisma";
import BannedScreen from "@/components/bannedScreen";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: session } = await auth.getSession();

  if (session?.user) {
    await syncUser(session.user);
  }

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });

  if (!user) return null;

  if (
    user.banned &&
    user.banExpiry &&
    user.banExpiry <= new Date()
  ) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        banned: false,
        banReason: null,
        banExpiry: null,
      },
    });

    user.banned = false;
  }

  if (user.banned) {
    return <BannedScreen />;
  }

  return (
    

        <Providers>
          <SidebarProvider>
            <div className="flex h-screen w-full no-scrollbar">
              <AppSidebar />

              <main className="flex-1 relative overflow-hidden">
                <div className="fixed top-0 z-100">
                  <SidebarTrigger />
                </div>

                <div className="h-full">
                  <TooltipProvider>
                    {children}
                  </TooltipProvider>
                </div>
              </main>
            </div>
          </SidebarProvider>
          <Toaster position="top-right" richColors closeButton theme="system" toastOptions={{
            className: 'font-mono animate-in fade-in',
            classNames: {
              title: 'font-bold text-xl'
            }
          }} />
        </Providers>
  );
}
