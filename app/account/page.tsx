import Link from "next/link";
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

  const { data: orders } = await supabase
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

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              My Account
            </p>
            <h1 className="text-4xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-[#7a6054]">{user.email}</p>
          </div>

          <form action="/account/auth/signout" method="post">
            <button className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-[#6b4f43] hover:bg-rose-50">
              Sign Out
            </button>
          </form>
        </div>

        {(!orders || orders.length === 0) && (
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            No reservations yet.
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

              return (
                <div
                  key={order.id}
                  className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md"
                >
                  <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Reservation #{order.id}
                      </h2>
                      <p className="text-[#7a6054]">{order.customer_name}</p>
                    </div>

                    <div className="text-sm text-[#8a6558]">
                      <p className="font-medium capitalize">Status: {order.status}</p>
                      <p>{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fffaf8] p-4">
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}