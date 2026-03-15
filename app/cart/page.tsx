"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/cart";
import { getCart, saveCart } from "@/lib/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  function updateQuantity(id: number, amount: number) {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    saveCart(updated);
  }

  function removeItem(id: number) {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-semibold">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
            <p className="text-lg text-[#7a6054]">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-rose-200 bg-white p-5 shadow-sm md:flex-row"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-36 w-full rounded-2xl object-cover md:w-36"
                  />

                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{item.name}</h2>
                    <p className="mb-2 text-sm text-[#8a6558]">
                      {item.category}
                    </p>
                    <p className="mb-4 text-sm text-[#7a6054]">
                      {item.description}
                    </p>
                    <p className="font-medium">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-full border border-rose-200 bg-white"
                      >
                        -
                      </button>
                      <span className="min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-full border border-rose-200 bg-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
              <div className="mb-4 flex justify-between text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="w-full rounded-full bg-[#b7c7a5] px-5 py-3 font-medium text-white transition hover:opacity-90">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}