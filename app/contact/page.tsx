"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import { useCart } from "@/context/CartContext";
import CartMenu from "@/app/components/CartMenu";

interface MyProduct {
  component: string;
  name: string;
  description: string;
  category?: string;
  image?: { filename: string } | string;
  price?: number | string;
  slug?: string;
  _version?: number;
}

interface StoryblokStory {
  slug: string;
  content: MyProduct & { Category?: string; Price?: number | string };
  _version?: number;
}

interface StoryblokApiResponse {
  stories?: StoryblokStory[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function Page() {
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MyProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addedToCartIndex, setAddedToCartIndex] = useState<number | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN;
    if (!token) {
      setErrorMsg("❌ Storyblok token not found.");
      setLoading(false);
      return;
    }
    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=product&version=draft&token=${token}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data: StoryblokApiResponse) => {
        const stories = data.stories || [];
        const productList: MyProduct[] = stories.map((story) => ({
          ...story.content,
          category:
            typeof story.content.Category === "string"
              ? story.content.Category.toLowerCase()
              : "uncategorized",
          price:
            typeof story.content.Price === "string"
              ? parseFloat(story.content.Price)
              : story.content.Price,
          slug: story.slug,
          _version: story._version,
        }));

        setProducts(productList);
        setFilteredProducts(productList);

        const uniqueCategories: string[] = Array.from(
          new Set(
            productList
              .map((p) => p.category)
              .filter((cat): cat is string => typeof cat === "string")
          )
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = products.filter((p) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category || "");

      const matchesSearch =
        (p.name?.toLowerCase().includes(term) ?? false) ||
        (p.description?.toLowerCase().includes(term) ?? false);

      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategories, products]);

  const handleAddToCart = (product: MyProduct, index: number) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    if (price === undefined || isNaN(price)) {
      alert("Invalid price");
      return;
    }
    addToCart({
      name: product.name || "Unnamed Product",
      price,
      quantity: 1,
    });
    setAddedToCartIndex(index);
    setTimeout(() => setAddedToCartIndex(null), 1500);
  };

  const getImageUrl = (
    image: MyProduct["image"],
    version?: number
  ): string | null => {
    if (typeof image === "string") {
      return image.startsWith("//") ? `https:${image}` : image;
    } else if (image?.filename) {
      return `https://a.storyblok.com${image.filename}?v=${version || "1"}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-semibold px-4">
        Loading products...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold px-4">
        ❌ {errorMsg}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg font-semibold px-4">
        No products found.
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      {/* Navbar only requires onSearch prop */}
      <Navbar onSearch={setSearchTerm} />

      <HeroSection />

      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-10 flex flex-col md:flex-row gap-6">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onSelect={setSelectedCategories}
        />

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product, i) => {
            const slug = product.slug || slugify(product.name || `product-${i}`);
            const imageUrl = getImageUrl(product.image, product._version);
            return (
              <Link key={slug} href={`/products/${slug}`}>
                <a>
                  <article className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="relative w-full pt-[75%] bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name || "Product image"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex flex-col h-full justify-between">
                      <div>
                        <h2 className="font-medium text-gray-900 text-base truncate">
                          {product.name || "Unnamed Product"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-2">
                        <p className="text-blue-600 font-semibold text-sm mb-1">
                          ${product.price ?? "N/A"}
                        </p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product, i);
                          }}
                          className={`w-full py-2 text-sm rounded-lg font-medium text-white ${
                            addedToCartIndex === i
                              ? "bg-green-600"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {addedToCartIndex === i ? "✔ Added" : "🛒 Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </article>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="px-4 mt-10 max-w-7xl mx-auto">
        <CartMenu />
      </div>
    </main>
  );
}
