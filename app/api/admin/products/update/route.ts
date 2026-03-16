import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import { getStoragePathFromPublicUrl } from "@/lib/storage-path";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(adminCookieName);

  if (adminCookie?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const id = Number(formData.get("id"));
    const slug = String(formData.get("slug") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price") || 0);
    const category = String(formData.get("category") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const oldImage = String(formData.get("old_image") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const long_description = String(formData.get("long_description") || "").trim();
    const light = String(formData.get("light") || "").trim();
    const water = String(formData.get("water") || "").trim();
    const pet_friendly = String(formData.get("pet_friendly") || "").trim();

    if (
      !id ||
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
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from("products")
      .update({
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
      })
      .eq("id", id);

    if (error) {
      console.error("Update product error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (oldImage && image !== oldImage) {
      const storagePath = getStoragePathFromPublicUrl(oldImage);

      if (storagePath) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([storagePath]);

        if (removeError) {
          console.error("Old image delete error:", removeError);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update route crash:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the product." },
      { status: 500 }
    );
  }
}