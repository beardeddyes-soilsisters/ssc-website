import { isAdminLoggedIn } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const loggedIn = await isAdminLoggedIn();

  if (loggedIn) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-xl rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
        <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
          Soil Sisters Admin
        </p>

        <h1 className="mb-4 text-3xl font-semibold">Admin Login</h1>

        <p className="mb-6 text-[#7a6054]">
          Enter the admin password to view contact messages.
        </p>

        <form action="/api/admin/login" method="post" className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#7a6054]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-rose-200 px-4 py-3 outline-none focus:border-[#b7c7a5]"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#b7c7a5] px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Log In
          </button>
        </form>

        {hasError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[#8b3a3a]">
            Incorrect password.
          </div>
        )}
      </div>
    </main>
  );
}