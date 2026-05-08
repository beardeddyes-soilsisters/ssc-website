"use client";

import { useState } from "react";

type Profile = {
  full_name: string | null;
  phone: string | null;
};

type Order = {
  id: number;
  status: string;
  created_at: string;
  pickup_notes: string | null;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
};

type AccountDashboardProps = {
  email: string;
  profile: Profile | null;
  orders: Order[];
  orderItems: OrderItem[];
};

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "ready for pickup":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "picked up":
      return "bg-green-100 text-green-800 border border-green-200";
    case "reserved":
      return "bg-rose-100 text-rose-800 border border-rose-200";
    case "canceled":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "cancel requested":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    default:
      return "bg-[#fffaf8] text-[#7a6054] border border-rose-200";
  }
}

export default function AccountDashboard({
  email,
  profile,
  orders,
  orderItems,
}: AccountDashboardProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("phone", phone);

      const res = await fetch("/api/account/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Could not update profile.");
        setSavingProfile(false);
        return;
      }

      setProfileMessage("Profile updated successfully.");
    } catch {
      setProfileError("Something went wrong.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleCancelRequest(orderId: number) {
    setCancelMessage("");
    setCancelError("");
    setCancelingId(orderId);

    try {
      const formData = new FormData();
      formData.append("order_id", String(orderId));

      const res = await fetch("/api/account/orders/cancel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error || "Could not request cancellation.");
        setCancelingId(null);
        return;
      }

      setCancelMessage(`Cancellation requested for reservation #${orderId}.`);
      window.location.reload();
    } catch {
      setCancelError("Something went wrong.");
    } finally {
      setCancelingId(null);
    }
  }

  const totalReservations = orders.length;
  const activeReservations = orders.filter(
    (order) =>
      order.status === "reserved" ||
      order.status === "ready for pickup" ||
      order.status === "cancel requested"
  ).length;
  const completedReservations = orders.filter(
    (order) => order.status === "picked up"
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            Customer Account
          </p>
          <h1 className="text-4xl font-semibold">{fullName || "My Account"}</h1>
          <p className="mt-2 text-[#7a6054]">{email}</p>
          <p className="text-[#7a6054]">{phone || "No phone saved"}</p>
        </div>

        <form action="/account/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-[#6b4f43] hover:bg-rose-50"
          >
            Log Out
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8a6558]">Total Reservations</p>
          <h2 className="mt-2 text-3xl font-semibold">{totalReservations}</h2>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8a6558]">Active Reservations</p>
          <h2 className="mt-2 text-3xl font-semibold">{activeReservations}</h2>
        </div>

        <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-[#8a6558]">Picked Up</p>
          <h2 className="mt-2 text-3xl font-semibold">
            {completedReservations}
          </h2>
        </div>
      </div>

      <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold">Profile Details</h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-2xl border border-rose-200 px-4 py-3"
          />

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-2xl border border-rose-200 px-4 py-3"
          />

          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-full bg-[#b7c7a5] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {profileMessage && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
            {profileMessage}
          </div>
        )}

        {profileError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
            {profileError}
          </div>
        )}
      </div>

      {cancelMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
          {cancelMessage}
        </div>
      )}

      {cancelError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
          {cancelError}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
          <p className="text-lg text-[#7a6054]">No reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const itemsForOrder = orderItems.filter(
              (item) => item.order_id === order.id
            );

            const total = itemsForOrder.reduce(
              (sum, item) => sum + Number(item.price) * Number(item.quantity),
              0
            );

            const totalItemCount = itemsForOrder.reduce(
              (sum, item) => sum + Number(item.quantity),
              0
            );

            const canRequestCancel =
              order.status === "reserved" ||
              order.status === "ready for pickup";

            return (
              <div
                key={order.id}
                className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md"
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Reservation #{order.id}
                    </h2>

                    <div className="mt-2">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#8a6558]">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#fffaf8] px-4 py-3 text-right">
                    <p className="text-sm text-[#8a6558]">Items Reserved</p>
                    <p className="text-2xl font-semibold">{totalItemCount}</p>
                  </div>
                </div>

                {order.pickup_notes && (
                  <div className="mb-5 rounded-2xl bg-[#fffaf8] p-4">
                    <p className="text-sm font-semibold text-[#8a6558]">
                      Pickup Notes
                    </p>
                    <p className="mt-1 text-[#5f4638]">{order.pickup_notes}</p>
                  </div>
                )}

                <div className="rounded-2xl bg-[#fffaf8] p-4">
                  <p className="mb-3 text-sm font-semibold text-[#8a6558]">
                    Reserved Items
                  </p>

                  {itemsForOrder.length === 0 ? (
                    <p className="text-[#7a6054]">
                      No item details found for this reservation yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {itemsForOrder.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 border-b border-rose-100 pb-3 last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="h-16 w-16 rounded-2xl object-cover border border-rose-200"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-white text-xs text-[#8a6558]">
                                No Image
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-[#5f4638]">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-[#8a6558]">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-medium text-[#5f4638]">
                              $
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toFixed(2)}
                            </p>
                            <p className="text-sm text-[#8a6558]">
                              ${Number(item.price).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-4 font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {canRequestCancel && (
                  <div className="mt-5">
                    <button
                      onClick={() => handleCancelRequest(order.id)}
                      disabled={cancelingId === order.id}
                      className="rounded-full border border-red-200 bg-white px-5 py-2 font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {cancelingId === order.id
                        ? "Requesting..."
                        : "Request Cancellation"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
