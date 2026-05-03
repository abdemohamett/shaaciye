'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'Vegetables', image: '/images/vegtables.png', count: 24 },
  { id: 2, name: 'Fruits', image: '/images/fruits.png', count: 18 },
  { id: 3, name: 'Sweets', image: '/images/sweets.png', count: 32 },
  { id: 4, name: 'Drinks', image: '/images/drinks.png', count: 15 },
  { id: 5, name: 'Baby Care', image: '/images/babycare.png', count: 12 },
  { id: 6, name: 'Fresh Meat', image: '/images/meat.png', count: 8 },
  { id: 7, name: 'Home Care', image: '/images/homecare.png', count: 21 },
];

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryDrawer({ isOpen, onClose }: CategoryDrawerProps) {
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
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] md:inset-y-0 md:left-auto md:right-0 md:w-[400px] md:max-h-full md:rounded-none md:rounded-l-2xl ${
          isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between md:px-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-500">{categories.length} categories</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Categories List */}
        <div className="p-4 pb-14 md:p-6 overflow-y-auto max-h-[calc(85vh-80px)] md:max-h-[calc(100vh-80px)]">
          <div className="space-y-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
