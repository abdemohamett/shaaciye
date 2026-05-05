'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, RefreshCw, Smartphone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import FixedCartSidebar from '@/components/FixedCartSidebar';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  description?: string;
  inStock: boolean;
  category?: {
    name: string;
  };
  features?: string[];
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { items, addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Fallback mock data for development
          const mockProducts: Product[] = [
            {
              id: 1,
              name: "Fresh Organic Apples",
              weight: "1kg",
              price: "4.99",
              originalPrice: "6.99",
              image: "/images/apple.jpg",
              badge: "Organic",
              description: "Crisp and sweet organic apples, perfect for snacking or baking. These apples are hand-picked from local orchards and delivered fresh to your doorstep.",
              inStock: true,
              category: { name: "Fruits" },
              features: [
                "100% Organic",
                "Locally Sourced",
                "Rich in Fiber",
                "Vitamin C Rich"
              ],
              nutrition: {
                calories: "52 kcal",
                protein: "0.3g",
                carbs: "14g",
                fat: "0.2g"
              }
            },
            {
              id: 2,
              name: "Premium Tomatoes",
              weight: "500g",
              price: "3.49",
              image: "/images/tomato.jpg",
              badge: "Premium",
              description: "Juicy and flavorful premium tomatoes, perfect for salads, sauces, or sandwiches. Grown in greenhouse conditions for consistent quality.",
              inStock: true,
              category: { name: "Vegetables" },
              features: [
                "Greenhouse Grown",
                "Pesticide Free",
                "High in Lycopene",
                "Farm Fresh"
              ],
              nutrition: {
                calories: "18 kcal",
                protein: "0.9g",
                carbs: "3.9g",
                fat: "0.2g"
              }
            }
          ];
          
          const foundProduct = mockProducts.find(p => p.id === parseInt(resolvedParams.id));
          setProduct(foundProduct || null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const cartItem = items.find((item) => item.id === product?.id);
  const qty = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          image: product.image,
          price: parseFloat(product.price),
        });
      }
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Skeleton */}
            <div className="flex items-center justify-center order-1 lg:order-1">
              <Skeleton className="w-full max-w-xs sm:max-w-md aspect-square rounded-xl" />
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>

              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link
              href="/categories"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground truncate">{product.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Single Image */}
          <div className="flex items-center justify-center order-1 lg:order-1">
            <div className="relative w-full max-w-xs sm:max-w-md aspect-square bg-white rounded-xl border border-border overflow-hidden shadow-lg">
              {product.badge && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md z-10">
                  {product.badge}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 40vw, 30vw"
                className="object-cover"
                priority
                style={{
                  objectFit: 'contain',
                  padding: '0.75rem'
                }}
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Product Title and Price */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{product.name}</h1>
                {product.originalPrice && (
                  <span className="text-sm sm:text-lg text-muted-foreground line-through">
                    ${parseFloat(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  /{product.weight.includes('kg') ? 'kg' : product.weight.includes('pcs') ? 'pcs' : product.weight.includes('L') ? 'L' : 'item'}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {product.nutrition && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Nutrition Information</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calories:</span>
                      <span className="font-medium text-foreground">{product.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protein:</span>
                      <span className="font-medium text-foreground">{product.nutrition.protein}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carbs:</span>
                      <span className="font-medium text-foreground">{product.nutrition.carbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fat:</span>
                      <span className="font-medium text-foreground">{product.nutrition.fat}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            {/* <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free delivery on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>30-day return policy</span>
              </div>
            </div> */}

            {/* EVC Plus Payment */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/evc.png"
                  alt="EVC Plus"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-green-800 text-sm">Pay with EVC Plus</h4>
                  <p className="text-xs text-green-600">Send money to complete your order</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">EVC Number:</span>
                </div>
                <span className="text-lg font-bold text-green-700">+252 61 234 5678</span>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Quantity</label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 sm:w-24 sm:h-12 text-center border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base sm:text-lg"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                  product.inStock 
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg active:scale-95' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {qty > 0 && (
                <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">In cart: {qty} items</span>
                    <span className="text-xs sm:text-sm text-primary font-medium">
                      ${(parseFloat(product.price) * qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
    <FixedCartSidebar />
    </>
  );
}
