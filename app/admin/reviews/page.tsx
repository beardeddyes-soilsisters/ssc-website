import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export default async function AdminReviewsPage() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-8 inline-block text-sm text-[#7a6054] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
          <h1 className="mb-4 text-4xl font-semibold">Reviews</h1>
          <p className="text-lg text-[#7a6054]">
            Review moderation and approval tools will go here next.
          </p>
        </div>
      </div>
    </main>
  );
}