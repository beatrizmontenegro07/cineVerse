'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Icon } from './icon';

interface MediaImageProps {
  src: string | null;
  alt: string;
  sizes: string;
  imageClassName?: string;
  fallbackIcon?: 'film' | 'user';
  fallbackLabel?: string;
}

export function MediaImage({
  src,
  alt,
  sizes,
  imageClassName = '',
  fallbackIcon = 'film',
  fallbackLabel = 'Pôster indisponível',
}: MediaImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (src && src !== failedSource) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        onError={() => setFailedSource(src)}
        className={`object-cover ${imageClassName}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_top,#322442,#14101c)] px-3 text-[#a08ab6]"
    >
      <Icon
        name={fallbackIcon}
        className={fallbackIcon === 'user' ? 'size-6' : 'size-10'}
      />
      {fallbackLabel && (
        <span className="text-center text-xs">{fallbackLabel}</span>
      )}
    </div>
  );
}
