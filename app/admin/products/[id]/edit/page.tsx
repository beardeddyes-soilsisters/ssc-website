import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import EditProductForm from "@/components/admin/EditProductForm";

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

        <EditProductForm product={product} />
        </div>
      </div>
    </main>
  );
}