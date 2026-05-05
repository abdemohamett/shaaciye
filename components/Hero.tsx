import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full px-4 py-6 md:px-8 md:py-8 mt-10">
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg relative">
        {/* Mobile Banner - shown on mobile only */}
        <div className="md:hidden absolute inset-0">
          <Image
            src="/images/mobilebanner.png"
            alt="Fresh Groceries Banner"
            fill
            className="object-fill"
            priority
          />
        </div>
        
        {/* Web Banner - shown on tablet and desktop only */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/webbanner.png"
            alt="Fresh Groceries Banner"
            fill
            className="object-fill"
            priority
          />
        </div>
      </div>
    </section>
  );
}
