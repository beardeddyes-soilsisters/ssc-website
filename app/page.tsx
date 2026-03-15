import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f6] text-[#5f4638]">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            Floral plant shop
          </p>

          <h1 className="mb-6 text-5xl font-semibold leading-tight md:text-6xl">
            The Soil Sisters Co
          </h1>

          <p className="mb-6 max-w-xl text-lg leading-8 text-[#7a6054]">
            Where soil grows beauty and sparkle catches the light.
          </p>

          <p className="mb-8 max-w-xl text-base leading-7 text-[#7a6054]">
            A soft, welcoming plant shop for beautiful greenery, thoughtful gifts,
            and botanical charm.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-[#b7c7a5] px-6 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
            >
              Shop Plants
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-rose-200 bg-white px-6 py-3 font-medium text-[#6b4f43] transition hover:bg-rose-50"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-rose-200 bg-white p-8 shadow-lg">
          <div className="rounded-[24px] bg-gradient-to-b from-rose-50 to-[#fffaf8] p-8">
            <div className="mb-4 text-6xl">🌸🪴✨</div>
            <h2 className="mb-3 text-2xl font-semibold text-[#6b4f43]">
              Pastel floral plant shop
            </h2>
            <p className="leading-7 text-[#7a6054]">
              This space will become your featured products section, seasonal
              collections, and best sellers.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Houseplants</h3>
            <p className="text-[#7a6054]">
              Easy-care favorites and statement greenery for every room.
            </p>
          </div>

          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Gifts & Bundles</h3>
            <p className="text-[#7a6054]">
              Beautiful plant gifts with a soft floral brand style.
            </p>
          </div>

          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Seasonal Beauty</h3>
            <p className="text-[#7a6054]">
              Rotating collections, decor, and fresh botanical charm.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}