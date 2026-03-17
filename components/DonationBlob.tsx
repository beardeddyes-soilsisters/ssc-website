"use client";

import { useState } from "react";

export default function DonationBlob() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-gradient-to-br from-rose-100 via-pink-50 to-[#fffaf8] text-3xl shadow-xl transition hover:scale-105 hover:shadow-2xl"
        aria-label="Open donation popup"
      >
        🌸
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4 md:items-end md:justify-end md:p-6">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-rose-200 bg-[#fffaf8] shadow-2xl">
            <div className="absolute inset-0 opacity-70">
              <div className="absolute -left-6 -top-6 text-6xl">🌸</div>
              <div className="absolute right-6 top-6 text-4xl">🌿</div>
              <div className="absolute bottom-6 left-6 text-5xl">🌷</div>
              <div className="absolute bottom-10 right-10 text-4xl">✨</div>
              <div className="absolute left-1/2 top-1/3 text-3xl">🌼</div>
            </div>

            <div className="relative p-8">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-lg text-[#6b4f43] hover:bg-rose-50"
                aria-label="Close donation popup"
              >
                ×
              </button>

              <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
                Support a small business
              </p>

              <h2 className="mb-4 pr-10 text-3xl font-semibold text-[#5f4638]">
                Help The Soil Sisters Co grow
              </h2>

              <p className="mb-6 leading-7 text-[#7a6054]">
                If you love what we’re building and would like to support our
                small business, your donation helps us grow more beauty, more
                plants, and more local charm.
              </p>

              <div className="rounded-3xl bg-white/80 p-4">
                <p className="mb-4 text-sm leading-6 text-[#7a6054]">
                  Every bit of support helps with supplies, plant care,
                  seasonal inventory, and growing our dream.
                </p>

                <a
                  href="https://venmo.com/Beardeddyes"
                  className="inline-block w-full rounded-full bg-[#b7c7a5] px-6 py-4 text-center text-lg font-medium text-white transition hover:opacity-90"
                >
                  Donate Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}