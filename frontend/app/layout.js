import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from './provider';  // Client Componen
import { SocketIOProvider } from "./SocketIOProvider";
import AuthGuard from "@/components/AuthGuard";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexaConnect-Innovate the Way You Connect",
  description: "NexaConnect is a modern social media web application designed to revolutionize how people connect and communicate. Built with Next.js, it features real-time chatting, seamless user interactions, and a clean, responsive interface — making social networking smarter and faster.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <SocketIOProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </SocketIOProvider>
        </ReduxProvider>
        <Toaster/>
      </body>
    </html>
  );
}
