export default function AccountAuthPage() {
    return (
      <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              Soil Sisters Account
            </p>
            <h1 className="mb-4 text-3xl font-semibold">Sign In</h1>
  
            <form action="/account/auth/signin" method="post" className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
  
              <button
                type="submit"
                className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 font-medium text-white"
              >
                Sign In
              </button>
            </form>
          </div>
  
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
              New here?
            </p>
            <h2 className="mb-4 text-3xl font-semibold">Create Account</h2>
  
            <form action="/account/auth/signup" method="post" className="space-y-4">
              <input
                name="full_name"
                placeholder="Full name"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
              <input
                name="phone"
                placeholder="Phone number"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
  
              <button
                type="submit"
                className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 font-medium text-white"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }