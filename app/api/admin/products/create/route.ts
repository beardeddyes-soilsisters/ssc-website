import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(adminCookieName);

  if (adminCookie?.value !== "true") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const formData = await request.formData();

  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price") || 0);
  const category = String(formData.get("category") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const long_description = String(formData.get("long_description") || "").trim();
  const light = String(formData.get("light") || "").trim();
  const water = String(formData.get("water") || "").trim();
  const pet_friendly = String(formData.get("pet_friendly") || "").trim();

  if (
    !slug ||
    !name ||
    !category ||
    !image ||
    !description ||
    !long_description ||
    !light ||
    !water ||
    !pet_friendly
  ) {
    return NextResponse.redirect(new URL("/admin/products?error=1", request.url));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("products").insert([
    {
      slug,
      name,
      price,
      category,
      image,
      description,
      long_description,
      light,
      water,
      pet_friendly,
    },
  ]);

  if (error) {
    return NextResponse.redirect(new URL("/admin/products?error=1", request.url));
  }

  return NextResponse.redirect(new URL("/admin/products?success=1", request.url));
}