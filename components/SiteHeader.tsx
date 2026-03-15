"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCartCount() {
      setCartCount(getCartCount());
    }

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-rose-200 bg-[#fffaf8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold text-[#6b4f43]">
          The Soil Sisters Co
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm text-[#6b4f43] md:text-base">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <Link href="/reviews" className="hover:underline">
            Reviews
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/account" className="hover:underline">
            Account
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full border border-rose-200 bg-white px-4 py-2 hover:bg-rose-50"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#b7c7a5] px-2 text-xs font-semibold text-white shadow">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}