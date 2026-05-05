'use client';

import { useState } from 'react';
import Products from "@/components/Products";
import Navbar from "@/components/Navbar";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearchChange={setSearchQuery} />
      <div className="pt-4">
        <Products searchQuery={searchQuery} showAll={true} />
      </div>
    </div>
  );
}
