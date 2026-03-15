import "./globals.css";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "The Soil Sisters Co",
  description: "Where soil grows beauty and sparklet catches the light.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        
        <footer className="border-t border-rose-200 bg-[#fffaf8]">
          <div className="mx-auto max-w-6x1 px-6 py-8 text-center text-sm text-[#7d6155]">
            <p>The Soil Sisters Co.</p>
            <p>Where soil grows beauty and sparkle catches the light!</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
