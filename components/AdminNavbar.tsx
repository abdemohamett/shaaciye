'use client';

import React from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-2 ">
      {/* Logo */}
      <div className="shrink-0">
        <Image 
          width={120} 
          height={37} 
          src="/images/logo.png" 
          className="h-auto max-w-[120px]" 
          alt="Admin Dashboard" 
          priority
        />
      </div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </nav>
  );
}
