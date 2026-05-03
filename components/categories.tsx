'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CategoryDrawer from './CategoryDrawer';

const categories = [
  { id: 1, name: 'Vegetables', image: '/images/vegtables.png', href: '/categories/vegetables' },
  { id: 2, name: 'Fruits', image: '/images/fruits.png', href: '/categories/fruits' },
  { id: 3, name: 'Sweets', image: '/images/sweets.png', href: '/categories/sweets' },
  { id: 4, name: 'Drinks', image: '/images/drinks.png', href: '/categories/drinks' },
  { id: 5, name: 'Baby Care', image: '/images/babycare.png', href: '/categories/baby-care' },
  { id: 6, name: 'Fresh Meat', image: '/images/meat.png', href: '/categories/fresh-meat' },
  { id: 7, name: 'Home Care', image: '/images/homecare.png', href: '/categories/home-care' },
];

export default function Categories() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <section id="categories" className="w-full px-3 py-6 md:px-6 md:py-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Categories
          </h2>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            View all
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex flex-col items-center space-y-2 transition-transform duration-200 hover:scale-105"
            >
              {/* Icon Card */}
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center overflow-hidden border border-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                />
              </div>

              {/* Category Name */}
              <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-gray-900 transition-colors duration-200">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
