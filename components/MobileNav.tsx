'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';
import CategoryDrawer from './CategoryDrawer';
import { useCart } from '@/contexts/CartContext';
import { useCategory } from '@/contexts/CategoryContext';

export default function MobileNav() {
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { totalItems } = useCart();
  const { setSelectedCategory } = useCategory();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around h-14">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
              pathname === '/' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => setIsCategoriesOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
              isCategoriesOpen ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px] font-medium">Categories</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors relative ${
              isCartOpen ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CategoryDrawer
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        onCategorySelect={setSelectedCategory}
      />
    </>
  );
}
