"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { addItemToCart } from "@/lib/cart";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  stock_quantity: number;
  category: string;
  image: string;
  description: string;
  long_description: string;
  light: string;
  water: string;
  pet_friendly: string;
};

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.status === 404) {
          setProduct(null);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setLoadError(data.error || "Could not load product.");
          setLoading(false);
          return;
        }

        setProduct(data.product || null);
        setRelatedProducts(data.relatedProducts || []);
      } catch {
        setLoadError("Could not load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (!loading && !loadError && !product) {
    notFound();
  }

  function handleAddToCart() {
    if (!product) return;

    addItemToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        category: product.category,
        image: product.image,
        description: product.description,
      },
      quantity
    );

    setMessage(
      `${quantity} ${product.name}${quantity > 1 ? "s" : ""} added to cart!`
    );

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-rose-200 bg-white p-10 text-center shadow-md">
          Loading product...
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-red-200 bg-red-50 p-10 text-center shadow-md text-[#8b3a3a]">
          {loadError}
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/shop"
          className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
        >
          ← Back to Shop
        </Link>

        <div className="mb-16 grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] border border-rose-200 bg-white shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <p className="mb-3 inline-block rounded-full bg-[#f8e7ec] px-3 py-1 text-sm text-[#8a6558]">
              {product.category}
            </p>

            <h1 className="mb-3 text-4xl font-semibold">{product.name}</h1>

            <p className="mb-4 text-2xl font-semibold text-[#6b4f43]">
              ${Number(product.price).toFixed(2)}
            </p>

            <p className="mb-4 text-sm font-medium text-[#8a6558]">
              {product.stock_quantity > 0
                ? `${product.stock_quantity} available for local pickup`
                : "Currently sold out"}
            </p>

            <p className="mb-6 leading-7 text-[#7a6054]">
              {product.long_description}
            </p>

            <div className="mb-8 grid gap-4 rounded-3xl bg-[#fffaf8] p-5">
              <div>
                <span className="font-semibold">Light:</span> {product.light}
              </div>
              <div>
                <span className="font-semibold">Water:</span> {product.water}
              </div>
              <div>
                <span className="font-semibold">Pet Friendly:</span>{" "}
                {product.pet_friendly}
              </div>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="font-medium">Quantity</span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-rose-200 bg-white"
                >
                  -
                </button>

                <span className="min-w-[30px] text-center text-lg">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock_quantity, q + 1))
                  }
                  className="h-10 w-10 rounded-full border border-rose-200 bg-white"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              className={`w-full rounded-full px-6 py-4 text-lg font-medium text-white transition ${
                product.stock_quantity > 0
                  ? "bg-[#b7c7a5] hover:opacity-90"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              {product.stock_quantity > 0 ? "Add to Cart" : "Sold Out"}
            </button>

            {message && (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-[#4f6b46]">
                {message}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
                  You may also like
                </p>
                <h2 className="text-3xl font-semibold">
                  More botanical favorites
                </h2>
                <p className="mt-2 text-[#7a6054]">
                  More lovely finds from the shop.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="related-scrollbar flex gap-6 overflow-x-auto pb-4 pr-2 scroll-smooth">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[280px] max-w-[280px] flex-shrink-0 overflow-hidden rounded-[28px] border border-rose-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/product/${item.slug}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-56 w-full object-cover"
                      />
                    </Link>

                    <div className="p-6">
                      <p className="mb-2 inline-block rounded-full bg-[#f8e7ec] px-3 py-1 text-sm text-[#8a6558]">
                        {item.category}
                      </p>

                      <Link href={`/product/${item.slug}`}>
                        <h3 className="mb-2 text-2xl font-semibold hover:underline">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="mb-4 text-sm leading-6 text-[#7a6054]">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">
                          ${Number(item.price).toFixed(2)}
                        </span>

                        <Link
                          href={`/product/${item.slug}`}
                          className="rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white transition hover:opacity-90"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
