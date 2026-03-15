import { isAdminLoggedIn } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function AdminMessagesPage() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="mb-8 inline-block text-sm text-[#7a6054] hover:underline">
          ← Back to Admin Dashboard
        </Link>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              Soil Sisters Admin
            </p>
            <h1 className="text-4xl font-semibold">Contact Messages</h1>
          </div>

          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-[#6b4f43] hover:bg-rose-50"
            >
              Log Out
            </button>
          </form>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
            Could not load messages: {error.message}
          </div>
        )}

        {!error && (!messages || messages.length === 0) && (
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <p className="text-lg text-[#7a6054]">No messages yet.</p>
          </div>
        )}

        {!error && messages && messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((message: any) => (
              <div
                key={message.id}
                className="rounded-[32px] border border-rose-200 bg-white p-6 shadow-md"
              >
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{message.name}</h2>
                    <p className="text-[#7a6054]">{message.email}</p>
                  </div>

                  <div className="text-sm text-[#8a6558]">
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#fffaf8] p-4 leading-7 text-[#5f4638]">
                  {message.message}
                </div>

                <div className="mt-4">
                  <a
                    href={`mailto:${message.email}?subject=Reply from The Soil Sisters Co`}
                    className="inline-block rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white transition hover:opacity-90"
                  >
                    Reply by Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}