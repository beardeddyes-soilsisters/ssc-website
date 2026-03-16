"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AddProductForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!imageFile) {
      setErrorMessage("Please choose an image file.");
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);

      const uploadRes = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) {
        setErrorMessage(uploadJson.error || "Image upload failed.");
        setUploading(false);
        return;
      }

      formData.set("image", uploadJson.url);

      const createRes = await fetch("/api/admin/products/create", {
        method: "POST",
        body: formData,
      });

      if (!createRes.ok) {
        setErrorMessage("Product creation failed.");
        setUploading(false);
        return;
      }

      window.location.href = "/admin/products?success=1";
    } catch {
      setErrorMessage("Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="slug"
        placeholder="slug (example: golden-pothos)"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="name"
        placeholder="Product name"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="price"
        type="number"
        step="0.01"
        placeholder="Price"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="category"
        placeholder="Category"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-[#7a6054]">
          Product image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
          className="w-full rounded-2xl border border-rose-200 px-4 py-3"
        />
      </div>

      {previewUrl && (
        <div className="overflow-hidden rounded-3xl border border-rose-200 bg-[#fffaf8] p-3">
          <p className="mb-3 text-sm font-medium text-[#7a6054]">Image preview</p>
          <div className="relative h-56 w-full overflow-hidden rounded-2xl">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      <input type="hidden" name="image" />

      <textarea
        name="description"
        placeholder="Short description"
        required
        rows={3}
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <textarea
        name="long_description"
        placeholder="Long description"
        required
        rows={5}
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="light"
        placeholder="Light needs"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="water"
        placeholder="Water needs"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />
      <input
        name="pet_friendly"
        placeholder="Pet friendly?"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[#8b3a3a]">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 text-lg font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}