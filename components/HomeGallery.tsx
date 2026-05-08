"use client";

import { useEffect, useRef } from "react";

const images = [
  "/gallery/floral-bg.jpg",
  "/gallery/picture2.jpg",
  "/gallery/picture3.jpg",
  "/gallery/picture4.jpg",
];

export default function HomeGallery() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function scrollGallery(direction: "left" | "right") {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const atEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 5;

      if (atEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            Soil Sisters Gallery
          </p>

          <h2 className="text-4xl font-semibold text-[#5f4638]">
            Moments From The Shop
          </h2>

          <p className="mt-4 text-[#7a6054]">
            Plants, florals, sparkle, and cozy little moments.
          </p>
        </div>

        <div className="mb-4 flex justify-end gap-3">
          <button
            onClick={() => scrollGallery("left")}
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-[#6b4f43] shadow-sm hover:bg-rose-50"
          >
            ←
          </button>

          <button
            onClick={() => scrollGallery("right")}
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-[#6b4f43] shadow-sm hover:bg-rose-50"
          >
            →
          </button>
        </div>

        <div
          ref={scrollRef}
          className="gallery-scroll flex gap-6 overflow-hidden pb-4 scroll-smooth"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative min-w-[320px] overflow-hidden rounded-[32px] border border-rose-200 bg-white/70 shadow-xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="absolute left-6 top-6 animate-sparkle text-xl">
                  ✨
                </span>
                <span className="absolute right-10 top-16 animate-sparkle-delay text-lg">
                  ✨
                </span>
                <span className="absolute bottom-10 left-12 animate-sparkle text-lg">
                  ✨
                </span>
              </div>

              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
