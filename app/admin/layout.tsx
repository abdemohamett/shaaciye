'use client';

import { usePathname } from 'next/navigation';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { CartProvider } from '@/contexts/CartContext';
import AdminNavbar from '@/components/AdminNavbar';
import AdminBottomNav from '@/components/AdminBottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname?.startsWith('/admin/login');

  return (
    <CategoryProvider>
      <CartProvider>
        {!isLoginRoute && <AdminNavbar />}
        <main className={isLoginRoute ? '' : 'pt-20 pb-20'}>
          {children}
        </main>
        {!isLoginRoute && <AdminBottomNav />}
      </CartProvider>
    </CategoryProvider>
  );
}
