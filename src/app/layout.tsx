import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Waste2Worth — AI-Powered Industrial Waste Exchange",
  description:
    "Connect waste-generating companies with industries that can reuse waste as raw materials. AI-powered matching, value estimation, and circular supply chain discovery.",
  keywords: [
    "circular economy",
    "waste exchange",
    "industrial waste",
    "B2B marketplace",
    "sustainability",
    "waste management",
    "CO2 reduction",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white antialiased" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
