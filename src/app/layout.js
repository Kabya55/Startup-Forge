import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "StartupForge | Co-Founder Matching & Startup Team Builder",
    template: "%s | StartupForge",
  },
  description: "StartupForge is a platform connecting startup founders with talented professionals, co-founders, developers, designers, and marketers.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}
