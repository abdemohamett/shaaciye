'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Minus } from 'lucide-react';
import { ArrowLeft, Search } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image: string;
  count?: number;
}

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  categoryId?: number;
  inStock: boolean;
  category?: {
    name: string;
  };
}

function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: parseFloat(product.price),
    });
  };

  const handleIncrease = () => {
    updateQuantity(product.id, qty + 1);
  };

  const handleDecrease = () => {
    if (qty <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, qty - 1);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 p-3">
        {product.badge && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info Area */}
      <div className="px-3 pb-3 pt-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-green-600">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-green-600">
              /{product.weight.includes('kg') ? 'kg' : product.weight.includes('pcs') ? 'pcs' : product.weight.includes('L') ? 'L' : 'item'}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${parseFloat(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex items-center gap-0 bg-green-600 rounded-full shadow-md overflow-hidden"
            >
              <button
                onClick={handleDecrease}
                className="w-8 h-7 flex items-center justify-center text-white hover:bg-green-700 transition-colors active:bg-green-800"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-white w-6 text-center">
                {qty}
              </span>
              <button
                onClick={handleIncrease}
                className="w-8 h-7 flex items-center justify-center text-white hover:bg-green-700 transition-colors active:bg-green-800"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function CategoriesContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const categoryParam = searchParams.get('category');
    return categoryParam ? decodeURIComponent(categoryParam) : null;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Scroll to products section if category is selected from URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setTimeout(() => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryName: string) => {
    setLoadingProducts(true);
    setSelectedCategory(categoryName);
    // Scroll to products section
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
      setLoadingProducts(false);
    }, 100);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    // Scroll to categories section
    setTimeout(() => {
      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {selectedCategory ? selectedCategory : 'All Categories'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedCategory 
                  ? `${filteredProducts.length} products found` 
                  : `${categories.length} categories available`
                }
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={handleBackToCategories}
                className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Back to Categories
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {!selectedCategory && (
        <section id="categories-section" className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Categories Grid */}
          {loadingCategories ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {categories
                .filter(category => 
                  category.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group flex flex-col items-center space-y-3 transition-transform duration-200 hover:scale-105"
                  >
                    {/* Icon Card */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center overflow-hidden border border-gray-100">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={60}
                        height={60}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain"
                      />
                    </div>

                    {/* Category Name */}
                    <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-gray-900 transition-colors duration-200">
                      {category.name}
                    </span>
                    {category.count && (
                      <span className="text-xs text-gray-500">
                        {category.count} items
                      </span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </section>
      )}

      {/* Products Section */}
      {selectedCategory && (
        <section id="products-section" className="container mx-auto px-4 py-6">
          {/* Search Bar for Products */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search query</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <CategoriesContent />
    </Suspense>
  );
}
