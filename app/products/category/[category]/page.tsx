import StoryblokClient from "storyblok-js-client";
import { notFound } from "next/navigation";
import ProductPageLayout from "./ProductPageLayout";

const Storyblok = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN!,
  cache: { clear: "auto", type: "memory" },
});

interface RelatedRef {
  uuid: string;
  full_slug: string;
}

interface MyProduct {
  name: string;
  description: string;
  Price?: number | string;
  image?: { filename: string } | string;
  Category?: string;
  relatedproducts?: RelatedRef[];
}

interface StoryblokProduct {
  uuid: string;
  full_slug: string;
  content: {
    name?: string;
    Price?: number | string;
    image?: string | { filename?: string };
    Category?: string | object | null;
  };
}

function getImageUrl(image: MyProduct["image"]): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https:${image.filename}`;
  }
  return null;
}

// The key is here:
// params is a Promise resolving to the object with productSlug
export default async function Page({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  if (productSlug === "category") return notFound();

  try {
    const response = await Storyblok.get(`cdn/stories/products/${productSlug}`, {
      version: "draft",
    });

    const story = response.data.story;
    if (!story?.content) return notFound();

    const product: MyProduct = {
      ...story.content,
      Category:
        typeof story.content.Category === "string"
          ? story.content.Category
          : undefined,
    };

    const currentCategory = product.Category?.trim().toLowerCase();
    const currentUUID = story.uuid;
    const imageUrl = getImageUrl(product.image);

    let similarProducts: StoryblokProduct[] = [];

    if (currentCategory) {
      const all = await Storyblok.get("cdn/stories", {
        starts_with: "products/",
        version: "draft",
        per_page: 100,
        is_startpage: false,
      });

      similarProducts = (all.data.stories as StoryblokProduct[]).filter(
        (item) => {
          const cat =
            typeof item.content?.Category === "string"
              ? item.content.Category.trim().toLowerCase()
              : "";
          return cat === currentCategory && item.uuid !== currentUUID;
        }
      );
    }

    return (
      <ProductPageLayout
        product={product}
        imageUrl={imageUrl}
        similarProducts={similarProducts}
      />
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    return notFound();
  }
}
