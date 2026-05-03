import { Phone, MapPin, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Shaaciye"
                width={120}
                height={37}
                className="h-auto w-[120px]"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Your trusted grocery store in Mogadishu. Fresh products delivered to your doorstep with care and quality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#categories" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#products" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-green-600" />
                <span>+252 61 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Mogadishu, Somalia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-green-600" />
                <span>info@shaaciye.so</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Shaaciye. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-green-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-green-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
