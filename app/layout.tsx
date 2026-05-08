import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://soilsistersco.com"),
  title: "The Soil Sisters Co",
  description: "Where soil grows beauty and sparkle catches the light.",
  openGraph: {
    title: "The Soil Sisters Co",
    description: "Where soil grows beauty and sparkle catches the light.",
    url: "https://soilsistersco.com",
    siteName: "The Soil Sisters Co",
    images: [
      {
        url: "/soil-sisters-banner.jpg",
        width: 1200,
        height: 630,
        alt: "The Soil Sisters Co floral plant shop banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Soil Sisters Co",
    description: "Where soil grows beauty and sparkle catches the light.",
    images: ["/soil-sisters-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[url('/floral-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed">
        <SiteHeader />
        {children}

        <footer className="border-t border-rose-200 bg-[#fffaf8]/95 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#7d6155]">
            <p>The Soil Sisters Co.</p>
            <p>Where soil grows beauty and sparkle catches the light!</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
