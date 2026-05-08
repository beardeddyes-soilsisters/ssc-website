"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/cart";
import { getCart, saveCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | "warning" | ""
  >("");
  const supabase = createClient();

  useEffect(() => {
    setCartItems(getCart());

    async function loadUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (user.email) {
        setCustomerEmail(user.email);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        setCustomerName(profile.full_name);
      }

      if (profile?.phone) {
        setCustomerPhone(profile.phone);
      }
    }

    loadUserProfile();
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

  async function handleReserve() {
    setStatusMessage("");
    setStatusType("");

    if (!customerName || !customerEmail || !customerPhone) {
      setStatusType("error");
      setStatusMessage("Please fill out your name, email, and phone number.");
      return;
    }

    if (cartItems.length === 0) {
      setStatusType("error");
      setStatusMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          pickup_notes: pickupNotes,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusType("error");
        setStatusMessage(data.error || "Could not place reservation.");
        setSubmitting(false);
        return;
      }

      if (data.warning) {
        setStatusType("warning");
        setStatusMessage(`Reservation #${data.orderId} saved. ${data.warning}`);
      } else {
        setStatusType("success");
        setStatusMessage(`Reservation #${data.orderId} placed successfully.`);
      }

      setCartItems([]);
      saveCart([]);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setPickupNotes("");
    } catch {
      setStatusType("error");
      setStatusMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
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

            <div className="space-y-6">
              <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
                <div className="mb-4 flex justify-between text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-[#7a6054]">
                  No payment is taken online right now. This reserves your items
                  for local pickup.
                </p>
              </div>

              <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-semibold">
                  Reserve for Pickup
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3"
                  />
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3"
                  />
                  <textarea
                    placeholder="Pickup notes (optional)"
                    value={pickupNotes}
                    onChange={(e) => setPickupNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3"
                  />
                </div>

                <button
                  onClick={handleReserve}
                  disabled={submitting}
                  className="mt-5 w-full rounded-full bg-[#b7c7a5] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Reserving..." : "Reserve for Pickup"}
                </button>

                {statusMessage && (
                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-center ${
                      statusType === "success"
                        ? "border border-green-200 bg-green-50 text-[#4f6b46]"
                        : statusType === "warning"
                        ? "border border-yellow-200 bg-yellow-50 text-[#7a5d1a]"
                        : "border border-red-200 bg-red-50 text-[#8b3a3a]"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
