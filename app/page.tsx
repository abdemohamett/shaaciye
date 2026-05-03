'use client';

import { useState } from 'react';
import Categories from "@/components/categories";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Navbar onSearchChange={setSearchQuery} />
      <Hero />
      <Categories />
      <Products searchQuery={searchQuery} />
    </div>
  );
}
