import ProductCard from "@/components/ProductCard";

interface MyProduct {
  name: string;
  description?: string;
  Price?: number | string;
  slug?: string;
  image?: { filename: string } | string;
  _version?: number;
}

function getImageUrl(image: MyProduct["image"], version?: number): string | null {
  if (typeof image === "string") {
    return image.startsWith("//") ? `https:${image}` : image;
  } else if (image?.filename) {
    return `https://a.storyblok.com${image.filename}?v=${version || "1"}`;
  }
  return null;
}

export default function CategoryGrid({ products }: { products: MyProduct[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product, i) => {
        const imageUrl = getImageUrl(product.image, product._version);
        return (
          <ProductCard
            key={product.slug || i}
            name={product.name}
            slug={product.slug}
            description={product.description}
            price={product.Price ?? "N/A"}
            imageUrl={imageUrl}
          />
        );
      })}
    </div>
  );
}
