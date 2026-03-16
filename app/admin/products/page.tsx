import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import AddProductForm from "@/components/admin/AddProductForm";

type ProductsPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="mb-8">
          <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            Soil Sisters Admin
          </p>
          <h1 className="text-4xl font-semibold">Products</h1>
          <p className="mt-2 text-[#7a6054]">
            Add and manage products for your shop.
          </p>
        </div>

        {params.success === "1" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
            Product created successfully.
          </div>
        )}

        {params.success === "update" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
            Product updated successfully.
          </div>
        )}

        {params.success === "delete" && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
            Product deleted successfully.
          </div>
        )}

        {(params.error === "1" || params.error === "delete") && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
            Something went wrong. Check the fields and try again.
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold">Add Product</h2>

            <AddProductForm />
          </div>

          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold">Current Products</h2>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
                Could not load products: {error.message}
              </div>
            )}

            {!error && (!products || products.length === 0) && (
              <p className="text-[#7a6054]">No products yet.</p>
            )}

            {!error && products && products.length > 0 && (
              <div className="space-y-4">
                {products.map((product: any) => (
  <div
    key={product.id}
    className="rounded-3xl border border-rose-200 bg-[#fffaf8] p-5"
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <img
        src={product.image}
        alt={product.name}
        className="h-28 w-full rounded-2xl object-cover md:w-28"
      />

      <div className="flex-1">
        <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          <span className="text-lg font-semibold">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <p className="mb-2 text-sm text-[#8a6558]">
          {product.category} • {product.slug}
        </p>

        <p className="text-[#7a6054]">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-block rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white transition hover:opacity-90"
          >
            Edit
          </Link>

          <form action="/api/admin/products/delete" method="post">
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="rounded-full border border-red-200 bg-white px-5 py-2 font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}