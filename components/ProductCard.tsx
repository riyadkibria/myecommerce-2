import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  slug?: string;
  description?: string;
  price: number | string;
  imageUrl: string | null;
}

export default function ProductCard({
  name,
  slug,
  description,
  price,
  imageUrl,
}: ProductCardProps) {
  return (
    <Link href={slug ? `/products/${slug}` : "#"}>
      <div className="border rounded-lg shadow hover:shadow-lg p-4 transition duration-300">
        {imageUrl ? (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover rounded"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <h3 className="text-lg font-semibold">{name}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        <p className="mt-2 text-blue-600 font-bold">${price}</p>
      </div>
    </Link>
  );
}
