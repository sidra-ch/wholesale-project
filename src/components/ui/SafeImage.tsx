"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/images/placeholder.svg";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallback?: string;
};

export function SafeImage({ fallback = PLACEHOLDER, src, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallback)}
    />
  );
}
