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
  const id = Number(formData.get("id"));

  if (!id) {
    return NextResponse.redirect(
      new URL("/admin/products?error=delete", request.url)
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.redirect(
      new URL("/admin/products?error=delete", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/admin/products?success=delete", request.url)
  );
}