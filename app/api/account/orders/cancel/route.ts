import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const orderId = Number(formData.get("order_id"));

    if (!orderId) {
      return NextResponse.json({ error: "Invalid order." }, { status: 400 });
    }

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, user_id, status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (findError || !order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.status === "picked up" || order.status === "canceled") {
      return NextResponse.json(
        { error: "This order can no longer be canceled." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancel requested" })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}