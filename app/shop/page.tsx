"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addItemToCart } from "@/lib/cart";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  long_description: string;
  light: string;
  water: string;
  pet_friendly: string;
};

const categories = [
  "All",
  "Houseplants",
  "Easy Care",
  "Planters",
  "Bundles",
  "Flowering",
  "Succulents",
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          setLoadError(data.error || "Could not load products.");
          setLoading(false);
          return;
        }

        setProducts(data.products || []);
      } catch {
        setLoadError("Could not load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const dynamicCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  function handleAddToCart(product: Product) {
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
      1
    );

    setCartMessage(`${product.name} added to cart!`);

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            Floral pastel collection
          </p>
          <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
            Shop Our Plants
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#7a6054]">
            Browse beautiful plants, gifts, and botanical favorites for your
            home or someone special.
          </p>
        </div>

        <div className="mb-8 rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-[#7a6054]"
            >
              Search products
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-rose-200 px-4 py-3 outline-none focus:border-[#b7c7a5]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {dynamicCategories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#b7c7a5] text-white"
                      : "border border-rose-200 bg-[#fffaf8] text-[#6b4f43] hover:bg-rose-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {cartMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-[#4f6b46] shadow-sm">
            {cartMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-[28px] border border-rose-200 bg-white p-10 text-center shadow-sm">
            <p className="text-[#7a6054]">Loading products...</p>
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-10 text-center shadow-sm text-[#8b3a3a]">
            {loadError}
          </div>
        )}

        {!loading && !loadError && (
          <>
            <div className="mb-6 text-sm text-[#7a6054]">
              Showing {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[28px] border border-rose-200 bg-white p-10 text-center shadow-sm">
                <h2 className="mb-2 text-2xl font-semibold">No products found</h2>
                <p className="text-[#7a6054]">
                  Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[28px] border border-rose-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/product/${product.slug}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-64 w-full object-cover"
                      />
                    </Link>

                    <div className="p-6">
                      <p className="mb-2 inline-block rounded-full bg-[#f8e7ec] px-3 py-1 text-sm text-[#8a6558]">
                        {product.category}
                      </p>

                      <Link href={`/product/${product.slug}`}>
                        <h2 className="mb-2 text-2xl font-semibold hover:underline">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mb-4 text-sm leading-6 text-[#7a6054]">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white transition hover:opacity-90"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}