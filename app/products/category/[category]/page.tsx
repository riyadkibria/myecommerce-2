// app/products/category/[category]/page.tsx

import CategoryGrid from "./CategoryGrid";
import StoryblokClient from "storyblok-js-client";
import { notFound } from "next/navigation";

const storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// ✅ this is the type Next.js expects for route params
type PageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = params;

  // Replace this with your real Storyblok query
  const response = await storyblok.get(`cdn/stories`, {
    starts_with: `products/${category}`,
    version: "draft",
  });

  const stories = response.data?.stories;

  if (!stories || stories.length === 0) {
    notFound();
  }

  const products = stories.map((story: any) => story.content);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{category}</h1>
      <CategoryGrid products={products} />
    </main>
  );
}
