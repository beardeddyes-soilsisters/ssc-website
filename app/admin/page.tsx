import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin-auth";

const adminSections = [
  {
    title: "Messages",
    description: "Read and reply to contact form messages from customers.",
    href: "/admin/messages",
    emoji: "📨",
  },
  {
    title: "Orders",
    description: "View customer orders, payment status, and fulfillment later.",
    href: "/admin/orders",
    emoji: "🧾",
  },
  {
    title: "Reviews",
    description: "Approve, remove, and manage customer reviews.",
    href: "/admin/reviews",
    emoji: "⭐",
  },
  {
    title: "Products",
    description: "Manage products, prices, inventory, and categories.",
    href: "/admin/products",
    emoji: "🪴",
  },
];

export default async function AdminDashboardPage() {
  const loggedIn = await isAdminLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              Soil Sisters Admin
            </p>
            <h1 className="text-4xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-[#7a6054]">
              Manage the shop, customers, and messages in one place.
            </p>
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

        <div className="grid gap-6 md:grid-cols-2">
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl">{section.emoji}</div>
              <h2 className="mb-3 text-2xl font-semibold">{section.title}</h2>
              <p className="mb-5 leading-7 text-[#7a6054]">
                {section.description}
              </p>
              <span className="inline-block rounded-full bg-[#b7c7a5] px-5 py-2 font-medium text-white">
                Open {section.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}