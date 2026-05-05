'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
          <Link
            href="/categories"
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
          >
            View all
          </Link>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-lg" />
                <Skeleton className="h-3 w-12 md:w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories?category=${encodeURIComponent(category.name)}`}
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
        )}
      </section>
    </>
  );
}
