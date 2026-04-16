"use client";

import { useState, use, useEffect } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchProduct } from "@/lib/api-data";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import { useHydration } from "@/hooks/useHydration";
import { toast } from "@/components/ui/Toaster";
import { openWhatsApp } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Lock,
  Package,
  Truck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.items.includes(product?.id || ""));
  const hydrated = useHydration();

  useEffect(() => {
    fetchProduct(slug).then(({ product: data, related: relData }) => {
      setProduct(data);
      setRelated(relData);
      if (data) setQuantity(data.moq);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse text-gray-400">Loading product...</div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="text-candy mt-4 inline-block">
          Back to Products
        </Link>
      </Container>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    openCart();
    toast(`${product.name} added to cart`);
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "ingredients", label: "Ingredients" },
    { id: "packaging", label: "Packaging" },
    { id: "delivery", label: "Delivery Info" },
  ];

  const tabContent: Record<string, string> = {
    description: product.description,
    ingredients: product.ingredients || "No ingredient information available.",
    packaging: product.packaging || "Standard packaging.",
    delivery:
      product.deliveryInfo || "Standard delivery: 3-5 business days.",
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />
      <section className="py-8 lg:py-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          >
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square bg-light-gray rounded-2xl overflow-hidden mb-4 group">
                <SafeImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (selectedImage - 1 + product.images.length) %
                            product.images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (selectedImage + 1) % product.images.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                        i === selectedImage
                          ? "border-candy"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-text mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                {hydrated && isAuthenticated ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-chocolate">
                        Rs {product.price.toFixed(2)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-lg text-gray-400 line-through">
                          Rs {product.comparePrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        per {product.unit}
                      </span>
                    </div>
                    {/* Price Tiers */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-light-gray/50 rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Retail</p>
                        <p className="text-sm font-bold text-gray-600 mt-0.5">Rs {product.retailPrice?.toFixed(2) || product.comparePrice?.toFixed(2) || "—"}</p>
                      </div>
                      <div className="bg-chocolate/5 rounded-xl p-3 text-center border-2 border-chocolate/20">
                        <p className="text-[10px] text-chocolate uppercase font-semibold tracking-wider">Wholesale</p>
                        <p className="text-sm font-bold text-chocolate mt-0.5">Rs {product.price.toFixed(2)}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                        <p className="text-[10px] text-emerald-600 uppercase font-semibold tracking-wider">VIP/Distributor</p>
                        <p className="text-sm font-bold text-emerald-600 mt-0.5">Rs {product.distributorPrice?.toFixed(2) || "—"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Lock className="h-5 w-5" />
                    <span className="text-lg font-medium">
                      Login to view wholesale price
                    </span>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`inline-flex items-center gap-2 text-sm font-medium mb-5 transition-colors ${
                  isWishlisted ? "text-candy" : "text-gray-400 hover:text-candy"
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-chocolate text-white px-3 py-1">
                  MOQ: {product.moq} {product.unit}
                </Badge>
                {product.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-700 px-3 py-1">
                    <Package className="h-3 w-3 mr-1" />
                    {product.stock} in stock
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-600 px-3 py-1">
                    Out of stock
                  </Badge>
                )}
                {product.comparePrice && (
                  <Badge className="bg-candy text-white px-3 py-1">
                    Save{" "}
                    {Math.round(
                      ((product.comparePrice - product.price) /
                        product.comparePrice) *
                        100
                    )}
                    %
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quantity & Add to Cart */}
              {hydrated && isAuthenticated ? (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-sm font-medium text-dark-text mb-2 block">
                      Quantity (min: {product.moq})
                    </label>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      min={product.moq}
                      max={product.stock}
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-candy text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart — Rs {(product.price * quantity).toFixed(2)}
                  </button>
                  <button
                    onClick={() => {
                      openWhatsApp({ productName: product.name, moq: product.moq, price: `Rs ${product.price}` });
                      toast("Sent to WhatsApp", "whatsapp", "Our team will reply shortly");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#25D366]/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Order on WhatsApp
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-chocolate text-white rounded-xl font-semibold text-sm hover:bg-chocolate/90 transition-colors"
                  >
                    <Lock className="h-5 w-5" />
                    Login to Order
                  </Link>
                  <button
                    onClick={() => {
                      openWhatsApp({ productName: product.name, moq: product.moq, price: `Rs ${product.price}` });
                      toast("Sent to WhatsApp", "whatsapp", "Our team will reply shortly");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#25D366]/30 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Order on WhatsApp
                  </button>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-light-gray/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-candy" />
                  Free delivery over Rs 500
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-candy" />
                  Quality guaranteed
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mt-12 lg:mt-16">
            <div className="border-b border-gray-200">
              <div className="flex gap-0 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-candy text-candy"
                        : "border-transparent text-gray-400 hover:text-dark-text"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="py-6">
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                {tabContent[activeTab]}
              </p>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="h-5 w-5 text-candy" />
                <h2 className="text-xl font-bold text-dark-text">Related Products</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
