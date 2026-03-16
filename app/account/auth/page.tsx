"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountAuthPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          full_name: fullName,
          phone,
        });
      }

      setMessage("Account created. You can now sign in.");
      setMode("signin");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/account";
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-xl rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
        <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
          Soil Sisters Account
        </p>

        <h1 className="mb-4 text-3xl font-semibold">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-3"
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full rounded-2xl border border-rose-200 px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-2xl border border-rose-200 px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {message && (
          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-[#4f6b46]">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
            {error}
          </div>
        )}

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage("");
            setError("");
          }}
          className="mt-6 text-sm text-[#7a6054] hover:underline"
        >
          {mode === "signin"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}