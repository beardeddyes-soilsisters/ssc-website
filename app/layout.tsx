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
      <body className="relative overflow-x-hidden bg-[#fff8f6]">
        {/* Floral Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-35"
            style={{
              backgroundImage: "url('/floral-bg.png')",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,248,246,0.82) 30%, rgba(255,248,246,0.55) 65%, rgba(255,248,246,0.25) 100%)",
            }}
          />
        </div>

        {/* Website Content */}
        <div className="relative z-10">
          <SiteHeader />
          {children}

          <footer className="border-t border-rose-200 bg-[#fffaf8]/80 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-[#7d6155]">
              <p>The Soil Sisters Co.</p>
              <p>Where soil grows beauty and sparkle catches the light!</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
