import StoryblokClient from "storyblok-js-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

// Define types
interface ProductContent {
  name: string;
  description: string;
  price: number;
  image: { filename: string; alt: string };
  category: string;
  slug: string;
}

interface ProductStory {
  name: string;
  uuid: string;
  slug: string;
  full_slug: string;
  content: ProductContent;
}

interface PageProps {
  params: { category: string };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = params;

  // Fetch products by category
  const { data } = await storyblok.get("cdn/stories", {
    starts_with: "products/",
    version: "draft",
  });

  const allProducts: ProductStory[] = data.stories;

  // Filter by category
  const filteredProducts = allProducts.filter(
    (product) => product.content.category.toLowerCase() === category.toLowerCase()
  );

  if (!filteredProducts.length) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredProducts.map((product) => (
        <Link href={`/products/${product.slug}`} key={product.uuid} className="border rounded-xl p-4 hover:shadow-lg transition">
          <div className="aspect-w-1 aspect-h-1 relative">
            <Image
              src={product.content.image.filename}
              alt={product.content.image.alt || product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h2 className="text-lg font-semibold mt-2">{product.content.name}</h2>
          <p className="text-gray-600">{product.content.description}</p>
          <p className="text-blue-600 font-bold mt-1">${product.content.price}</p>
        </Link>
      ))}
    </div>
  );
}
