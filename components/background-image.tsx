'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function BackgroundImage() {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="fixed inset-0 z-[-1] bg-gray-900">
        {/* Fallback dark background */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] print:hidden">
      <Image
        src="/images/hero-bg-2.png"
        alt="Background"
        fill
        priority
        style={{ objectFit: 'cover' }}
        quality={100}
        onError={() => setImageError(true)}
      />
    </div>
  );
}