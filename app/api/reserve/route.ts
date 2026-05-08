import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();

    const customer_name = String(body.customer_name || "").trim();
    const customer_email = String(body.customer_email || "").trim();
    const customer_phone = String(body.customer_phone || "").trim();
    const pickup_notes = String(body.pickup_notes || "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing customer information or cart items." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          pickup_notes,
          status: "reserved",
          user_id: user?.id ?? null,
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Could not create reservation." },
        { status: 500 }
      );
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_slug: item.slug,
      product_image: item.image ?? null,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);

      await supabase.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        { error: "Could not save reservation items." },
        { status: 500 }
      );
    }

    // Subtract stock using slug
    for (const item of items) {
      const slug = String(item.slug || "").trim();
      const quantity = Number(item.quantity || 0);

      if (!slug || quantity <= 0) continue;

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, stock_quantity")
        .eq("slug", slug)
        .single();

      if (productError || !product) {
        console.error("Stock lookup error:", productError, slug);
        continue;
      }

      const currentStock = Number(product.stock_quantity || 0);
      const newStock = Math.max(0, currentStock - quantity);

      const { error: stockError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", product.id);

      if (stockError) {
        console.error("Stock update error:", stockError, slug);
      }
    }

    const itemLines = items
      .map(
        (item: any) =>
          `<li>${escapeHtml(item.name)} × ${item.quantity} — $${Number(
            item.price
          ).toFixed(2)}</li>`
      )
      .join("");

    const { error: emailError } = await resend.emails.send({
      from: "Soil Sisters Orders <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL!],
      subject: `New pickup reservation from ${customer_name}`,
      replyTo: customer_email,
      html: `
        <h2>New Pickup Reservation</h2>
        <p><strong>Name:</strong> ${escapeHtml(customer_name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(customer_email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(customer_phone)}</p>
        <p><strong>Pickup Notes:</strong> ${escapeHtml(
          pickup_notes || "None"
        )}</p>
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Signed In Account:</strong> ${user ? "Yes" : "No"}</p>
        <h3>Reserved Items</h3>
        <ul>${itemLines}</ul>
      `,
    });

    if (emailError) {
      console.error("Reservation email error:", emailError);
      return NextResponse.json({
        ok: true,
        orderId: order.id,
        warning: "Reservation saved, but email notification failed.",
      });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Reserve route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the reservation." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
