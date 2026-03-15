"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "warning" | "error"
  >("idle");

  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(data.error || "Something went wrong.");
        return;
      }

      if (data.warning) {
        setStatus("warning");
        setStatusMessage(data.warning);
      } else {
        setStatus("success");
        setStatusMessage("Your message has been sent.");
      }

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      setStatus("error");
      setStatusMessage("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8f6] px-6 py-16 text-[#5f4638]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 inline-block rounded-full bg-rose-100 px-4 py-2 text-sm text-[#8a6558]">
            We’d love to hear from you
          </p>

          <h1 className="mb-4 text-4xl font-semibold md:text-5xl">Contact Us</h1>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7a6054]">
            Reach out with questions, plant requests, custom orders, or just to
            say hello. We’re happy to help.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold">Get in touch</h2>

            <div className="space-y-5 text-[#7a6054]">
              <div className="rounded-2xl bg-[#fffaf8] p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#8a6558]">
                  Email
                </p>
                <a
                  href="mailto:soilsisterstn@gmail.com"
                  className="mt-1 block text-lg text-[#5f4638] hover:underline"
                >
                  soilsisterstn@gmail.com
                </a>
              </div>

              <div className="rounded-2xl bg-[#fffaf8] p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#8a6558]">
                  Phone
                </p>
                <a
                  href="tel:2769713241"
                  className="mt-1 block text-lg text-[#5f4638] hover:underline"
                >
                  276-971-3241
                </a>
              </div>

              <div className="rounded-2xl bg-[#fffaf8] p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#8a6558]">
                  Facebook
                </p>
                <a
                  href="https://facebook.com/soilsisterco"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-lg text-[#5f4638] hover:underline"
                >
                  facebook.com/soilsisterco
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-rose-200 bg-white p-8 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold">Send a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#7a6054]"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-rose-200 px-4 py-3 outline-none focus:border-[#b7c7a5]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#7a6054]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-rose-200 px-4 py-3 outline-none focus:border-[#b7c7a5]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#7a6054]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-rose-200 px-4 py-3 outline-none focus:border-[#b7c7a5]"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 text-lg font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>

            {status !== "idle" && statusMessage && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-center ${
                  status === "success"
                    ? "border border-green-200 bg-green-50 text-[#4f6b46]"
                    : status === "warning"
                    ? "border border-yellow-200 bg-yellow-50 text-[#7a5d1a]"
                    : status === "error"
                    ? "border border-red-200 bg-red-50 text-[#8b3a3a]"
                    : ""
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}