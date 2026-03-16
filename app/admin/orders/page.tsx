import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

const statusOptions = [
  "reserved",
  "ready for pickup",
  "picked up",
  "canceled",
];

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">Orders</h1>
          <p className="mb-8 text-lg text-[#7a6054]">
            Local pickup reservations from customers.
          </p>

          {params.success === "1" && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
              Order status updated successfully.
            </div>
          )}

          {params.error === "1" && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
              Could not update order status.
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
              Could not load orders: {error.message}
            </div>
          )}

          {!error && (!orders || orders.length === 0) && (
            <p className="text-[#7a6054]">No reservations yet.</p>
          )}

          {!error && orders && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order: any) => {
                const itemsForOrder =
                  orderItems?.filter((item: any) => item.order_id === order.id) || [];

                const total = itemsForOrder.reduce(
                  (sum: number, item: any) =>
                    sum + Number(item.price) * Number(item.quantity),
                  0
                );

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-rose-200 bg-[#fffaf8] p-6"
                  >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold">
                          Reservation #{order.id}
                        </h2>
                        <p className="text-[#7a6054]">{order.customer_name}</p>
                        <p className="text-[#7a6054]">{order.customer_email}</p>
                        <p className="text-[#7a6054]">{order.customer_phone}</p>
                      </div>

                      <div className="text-sm text-[#8a6558]">
                        <p className="font-medium capitalize">Status: {order.status}</p>
                        <p>{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    {order.pickup_notes && (
                      <div className="mb-4 rounded-2xl bg-white p-4">
                        <p className="text-sm font-semibold text-[#8a6558]">
                          Pickup Notes
                        </p>
                        <p className="mt-1 text-[#5f4638]">{order.pickup_notes}</p>
                      </div>
                    )}

                    <div className="rounded-2xl bg-white p-4">
                      <p className="mb-3 text-sm font-semibold text-[#8a6558]">
                        Reserved Items
                      </p>

                      <div className="space-y-2">
                        {itemsForOrder.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-rose-100 pb-2 last:border-b-0"
                          >
                            <span>
                              {item.product_name} × {item.quantity}
                            </span>
                            <span>
                              ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-4 font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <a
                        href={`mailto:${order.customer_email}?subject=Your Soil Sisters reservation #${order.id}`}
                        className="inline-block rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white transition hover:opacity-90"
                      >
                        Email Customer
                      </a>

                      <form
                        action="/api/admin/orders/update-status"
                        method="post"
                        className="flex flex-wrap items-center gap-3"
                      >
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          type="submit"
                          className="rounded-full border border-rose-200 bg-white px-5 py-2 font-medium text-[#6b4f43] transition hover:bg-rose-50"
                        >
                          Update Status
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}