import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FlightMods",
  description: "Your platform for Flight Simulator Addons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}