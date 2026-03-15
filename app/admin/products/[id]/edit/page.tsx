import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const query = await searchParams;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/products"
            className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
          >
            ← Back to Products
          </Link>

          <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-[#8b3a3a] shadow-md">
            Product not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
        >
          ← Back to Products
        </Link>

        <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
          <h1 className="mb-2 text-4xl font-semibold">Edit Product</h1>
          <p className="mb-8 text-[#7a6054]">
            Update this product’s details.
          </p>

          {query.error === "1" && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
              Could not update product. Check the fields and try again.
            </div>
          )}

          <form action="/api/admin/products/update" method="post" className="space-y-4">
            <input type="hidden" name="id" value={product.id} />

            <input
              name="slug"
              defaultValue={product.slug}
              placeholder="slug"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="name"
              defaultValue={product.name}
              placeholder="Product name"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={product.price}
              placeholder="Price"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="category"
              defaultValue={product.category}
              placeholder="Category"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="image"
              defaultValue={product.image}
              placeholder="Image URL"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <textarea
              name="description"
              defaultValue={product.description}
              placeholder="Short description"
              required
              rows={3}
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <textarea
              name="long_description"
              defaultValue={product.long_description}
              placeholder="Long description"
              required
              rows={5}
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="light"
              defaultValue={product.light}
              placeholder="Light needs"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="water"
              defaultValue={product.water}
              placeholder="Water needs"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <input
              name="pet_friendly"
              defaultValue={product.pet_friendly}
              placeholder="Pet friendly?"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 text-lg font-medium text-white transition hover:opacity-90"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}