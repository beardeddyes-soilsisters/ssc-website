import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProducts() {
  return await supabase.from("products").select("*").order("created_at", {
    ascending: false,
  });
}

export async function createProduct(formData: {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  long_description: string;
  light: string;
  water: string;
  pet_friendly: string;
}) {
  return await supabase.from("products").insert([formData]);
}