'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CategoryDrawer from './CategoryDrawer';
import { useCategory } from '@/contexts/CategoryContext';

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function Categories() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCategory } = useCategory();

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
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
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
              </button>
            ))}
          </div>
        )}
      </section>
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onCategorySelect={setSelectedCategory}
      />
    </>
  );
}
