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
      <body>
        <SiteHeader />
        {children}

        <footer className="border-t border-rose-200">
          <div className="relative h-40 w-full overflow-hidden">
            <img
              src="/header-img.jpg"
              alt="The Soil Sisters Co Banner"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#fff8f6]/40 to-transparent" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm font-medium text-[#5f4638] drop-shadow-sm">
                Where soil grows beauty and sparkle catches the light ✨
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
