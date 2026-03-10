import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800">
          <div className="font-bold text-lg">
            <a href="/">FlightMods</a>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="/addons">Addons</a>
            <a href="/upload">Upload</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}