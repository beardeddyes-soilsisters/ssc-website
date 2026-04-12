import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderIds = (orders || []).map((order) => order.id);

  let orderItems: any[] = [];
  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds)
      .order("id", { ascending: true });

    orderItems = items || [];
  }

  const displayName = profile?.full_name || "My Account";
  const phone = profile?.phone || "No phone saved";

  const totalReservations = orders?.length || 0;
  const activeReservations =
    orders?.filter(
      (order) =>
        order.status === "reserved" || order.status === "ready for pickup"
    ).length || 0;
  const completedReservations =
    orders?.filter((order) => order.status === "picked up").length || 0;

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              Customer Account
            </p>
            <h1 className="text-4xl font-semibold">{displayName}</h1>
            <p className="mt-2 text-[#7a6054]">{user.email}</p>
            <p className="text-[#7a6054]">{phone}</p>
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

        <div className="mb-8 grid gap-6 md:grid-cols-3">
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
            <h2 className="mt-2 text-3xl font-semibold">{completedReservations}</h2>
          </div>
        </div>

        <div className="mb-8 rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
          <h2 className="mb-3 text-2xl font-semibold">Account Overview</h2>
          <p className="leading-7 text-[#7a6054]">
            This is your reservation dashboard. Here you can view your current
            and past local pickup reservations, check statuses, and review the
            plants or items you reserved.
          </p>
        </div>

        {ordersError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
            Could not load reservations: {ordersError.message}
          </div>
        )}

        {(!orders || orders.length === 0) && !ordersError && (
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <p className="text-lg text-[#7a6054]">No reservations yet.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const itemsForOrder = orderItems.filter(
                (item: any) => item.order_id === order.id
              );

              const total = itemsForOrder.reduce(
                (sum: number, item: any) =>
                  sum + Number(item.price) * Number(item.quantity),
                0
              );

              const totalItemCount = itemsForOrder.reduce(
                (sum: number, item: any) => sum + Number(item.quantity),
                0
              );

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
                      <p className="mt-1 text-[#7a6054] capitalize">
                        Status: {order.status}
                      </p>
                      <p className="text-sm text-[#8a6558]">
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
                        {itemsForOrder.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-rose-100 pb-3 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-[#5f4638]">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-[#8a6558]">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-medium text-[#5f4638]">
                                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}