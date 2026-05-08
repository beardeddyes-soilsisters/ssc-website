import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AccountDashboard from "@/components/account/AccountDashboard";

type Profile = {
  full_name: string | null;
  phone: string | null;
};

type Order = {
  id: number;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_notes: string | null;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
};

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

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders: Order[] = ordersData ?? [];

  const orderIds = orders.map((order) => order.id);

  let orderItems: OrderItem[] = [];

  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds)
      .order("id", { ascending: true });

    orderItems = items ?? [];
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <AccountDashboard
          email={user.email || ""}
          profile={(profile as Profile | null) ?? null}
          orders={orders}
          orderItems={orderItems}
        />
      </div>
    </main>
  );
}
