'use client';

import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';
import Footer from './Footer';

export default function RouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginRoute = pathname?.startsWith('/admin/login');

  return (
    <>
      {children}
      {!isAdminRoute && <MobileNav />}
      {!isAdminRoute && <Footer />}
    </>
  );
}
