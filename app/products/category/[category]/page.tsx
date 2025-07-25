import { notFound } from "next/navigation";
import CategoryGrid from "./CategoryGrid";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryLower = category.toLowerCase();

  try {
    const token = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!;
    const url = `https://api.storyblok.com/v2/cdn/stories?starts_with=products/&version=draft&token=${token}&per_page=100`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const data = await res.json();

    const filteredProducts = (data.stories || [])
      .map((story: any) => ({
        ...story.content,
        slug: story.slug,
        _version: story._version,
        Category:
          typeof story.content.Category === "string"
            ? story.content.Category.toLowerCase()
            : undefined,
      }))
      .filter((p: any) => p.Category === categoryLower);

    if (filteredProducts.length === 0) return notFound();

    return (
      <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 capitalize text-gray-900">
          {category}
        </h1>
        <CategoryGrid products={filteredProducts} />
      </main>
    );
  } catch (error) {
    console.error("Error loading category page:", error);
    return notFound();
  }
}
