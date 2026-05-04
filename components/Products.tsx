'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
  badge?: string;
  category?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    weight: '1 kg',
    price: 1.49,
    originalPrice: 1.99,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop&q=80',
    href: '/products/fresh-tomatoes',
    category: 'Vegetables',
  },
  {
    id: 2,
    name: 'Bananas',
    weight: '1 bunch',
    price: 0.99,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&h=400&fit=crop&q=80',
    href: '/products/bananas',
    category: 'Fruits',
  },

  {
    id: 4,
    name: 'Basmati Rice',
    weight: '5 kg',
    price: 8.99,
    originalPrice: 10.99,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80',
    href: '/products/basmati-rice',
    category: 'Home Care',
  },

  {
    id: 6,
    name: 'Cooking Oil',
    weight: '1 L',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&q=80',
    href: '/products/cooking-oil',
    category: 'Home Care',
  },
  {
    id: 7,
    name: 'Fresh Eggs',
    weight: '12 pcs',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&q=80',
    href: '/products/fresh-eggs',
    category: 'Fresh Meat',
  },
  {
    id: 8,
    name: 'Carrots',
    weight: '500 g',
    price: 0.89,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&q=80',
    href: '/products/carrots',
    category: 'Vegetables',
  },
  {
    id: 9,
    name: 'Spaghetti Pasta',
    weight: '500 g',
    price: 1.79,
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&h=400&fit=crop&q=80',
    href: '/products/spaghetti-pasta',
    category: 'Home Care',
  },
  {
    id: 10,
    name: 'Whole Milk',
    weight: '1 L',
    price: 2.29,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80',
    href: '/products/whole-milk',
    category: 'Drinks',
  },
  {
    id: 11,
    name: 'Green Apples',
    weight: '1 kg',
    price: 2.99,
    originalPrice: 3.49,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&q=80',
    href: '/products/green-apples',
    badge: '14% OFF',
    category: 'Fruits',
  },
  {
    id: 12,
    name: 'Sugar',
    weight: '1 kg',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&h=400&fit=crop&q=80',
    href: '/products/sugar',
    category: 'Sweets',
  },
];

function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
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
    <div
      // href={product.href}
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
        {/* <p className="text-xs text-gray-500 mt-0.5">{product.weight}</p> */}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-green-600">
              /{product.weight.includes('kg') ? 'kg' : product.weight.includes('pcs') ? 'pcs' : product.weight.includes('L') ? 'L' : 'item'}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
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
    </div>
  );
}

interface ProductsProps {
  searchQuery?: string;
  selectedCategory?: string | null;
}

export default function Products({ searchQuery = '', selectedCategory = null }: ProductsProps) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTitle = () => {
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
      <div className="flex justify-between items-center mb-5">
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
        {!searchQuery && !selectedCategory && (
          <Link
            href="/products"
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
          >
            See all
          </Link>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
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
