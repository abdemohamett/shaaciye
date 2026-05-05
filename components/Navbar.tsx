'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Grid3X3 } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ onSearchChange }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between w-full px-4  b/95 backdrop-blur-sm md:px-32 ">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Image 
          width={120} 
          height={37} 
          src="/images/logo.png" 
          className="max-w-[120px] h-auto md:max-w-[100px]" 
          alt="Grocery Gutenberg" 
          priority
        />
      </Link>
      
      {/* Search Bar - Center */}
      <div className="flex-1 max-w-lg mx-4 md:mx-8 relative">
        <div className="relative flex items-center">
          <input 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..." 
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500/20 md:px-4 md:py-2.5 md:pr-12 md:text-sm" 
            type="text" 
            autoComplete="off"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:right-3" />
        </div>
      </div>
      
      {/* Cart & Categories Buttons */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <Link
          href="/categories"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
          aria-label="Categories"
        >
          <Grid3X3 className="w-6 h-6" />
        </Link>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
