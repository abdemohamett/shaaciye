'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2, Smartphone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CheckoutDialog from '@/components/CheckoutDialog';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();
  const cartItems = items;
  const subtotal = totalPrice;
  const itemCount = totalItems;
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white shadow-2xl transition-transform duration-300 ease-out w-full max-w-md ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">{itemCount} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* EVC Plus Payment */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/evc.png"
                  alt="EVC Plus"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-green-800 text-xs">Pay with EVC Plus</h4>
                  <p className="text-xs text-green-600">Send money to complete order</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-gray-700">EVC:</span>
                </div>
                <span className="text-sm font-bold text-green-700">+252 61 234 5678</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                setIsCheckoutOpen(true);
              }}
              className="block w-full py-3 bg-green-600 text-white text-center font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="block w-full py-3 text-gray-600 text-center font-medium hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
      
      {/* Checkout Dialog */}
      <CheckoutDialog 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
}
