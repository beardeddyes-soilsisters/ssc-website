"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  stock_quantity: number;
  category: string;
  image: string;
  description: string;
  long_description: string;
  light: string;
  water: string;
  pet_friendly: string;
};

type EditProductFormProps = {
  product: Product;
};

export default function EditProductForm({ product }: EditProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(product.image);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(product.image);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, product.image]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/admin/products/upload-image", {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();

        if (!uploadRes.ok) {
          setErrorMessage(uploadJson.error || "Image upload failed.");
          setSaving(false);
          return;
        }

        formData.set("image", uploadJson.url);
      } else {
        formData.set("image", product.image);
      }

      const updateRes = await fetch("/api/admin/products/update", {
        method: "POST",
        body: formData,
      });

      const updateJson = await updateRes.json();

      if (!updateRes.ok) {
        setErrorMessage(updateJson.error || "Product update failed.");
        setSaving(false);
        return;
      }

      window.location.href = "/admin/products?success=update";
    } catch {
      setErrorMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="old_image" value={product.image} />
      <input type="hidden" name="image" value={product.image} />

      <input
        name="slug"
        defaultValue={product.slug}
        placeholder="slug"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="name"
        defaultValue={product.name}
        placeholder="Product name"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="price"
        type="number"
        step="0.01"
        defaultValue={product.price}
        placeholder="Price"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="stock_quantity"
        type="number"
        min="0"
        step="1"
        defaultValue={product.stock_quantity}
        placeholder="Stock quantity"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="category"
        defaultValue={product.category}
        placeholder="Category"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-[#7a6054]">
          Replace image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-rose-200 px-4 py-3"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-rose-200 bg-[#fffaf8] p-3">
        <p className="mb-3 text-sm font-medium text-[#7a6054]">
          Current image preview
        </p>
        <div className="relative h-56 w-full overflow-hidden rounded-2xl">
          <Image
            src={previewUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <textarea
        name="description"
        defaultValue={product.description}
        placeholder="Short description"
        required
        rows={3}
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <textarea
        name="long_description"
        defaultValue={product.long_description}
        placeholder="Long description"
        required
        rows={5}
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="light"
        defaultValue={product.light}
        placeholder="Light needs"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="water"
        defaultValue={product.water}
        placeholder="Water needs"
        required
        className="w-full rounded-2xl border border-rose-200 px-4 py-3"
      />

      <input
        name="pet_friendly"
        defaultValue={product.pet_friendly}
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
        disabled={saving}
        className="w-full rounded-full bg-[#b7c7a5] px-6 py-4 text-lg font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
