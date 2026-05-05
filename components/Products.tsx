'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';

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
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
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

interface ProductsProps {
  searchQuery?: string;
  selectedCategory?: string | null;
  showAll?: boolean;
}

export default function Products({ searchQuery = '', selectedCategory = null, showAll = false }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTitle = () => {
    if (showAll) {
      return 'All Products';
    }
    if (searchQuery && selectedCategory) {
      return `${selectedCategory}: "${searchQuery}"`;
    }
    if (searchQuery) {
      return `Search: "${searchQuery}"`;
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return 'Best Selling';
  };

  return (
    <section className="w-full px-3 py-6 md:px-6 md:py-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-5 pt-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {getTitle()}
          </h2>
          {(searchQuery || selectedCategory) && (
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {!searchQuery && !selectedCategory && !showAll && (
          <Link
            href="/products"
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
          >
            See all
          </Link>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
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
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </section>
  );
}
