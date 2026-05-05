'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function FixedCartSidebar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      {/* Fixed Cart Button - Desktop only */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl relative group"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[24px] h-[24px] flex items-center justify-center rounded-full px-1">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Cart ({totalItems} items)
          </span>
        </button>
      </div>

      {/* Use the same CartDrawer as mobile */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
