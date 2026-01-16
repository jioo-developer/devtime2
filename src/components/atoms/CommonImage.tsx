"use client";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

interface CommonImageProps {
  alt: string;
  src: string | StaticImageData;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
}

export default function CommonImage({
  alt,
  src,
  width,
  height,
  fill = false,
  className,
}: CommonImageProps) {
  const [isImgError, setIsImgError] = useState(false);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes="100vw"
        style={{ objectFit: "cover" }}
        onError={() => setIsImgError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes="100vw"
      style={{
        height: isImgError ? height : "auto",
      }}
      onError={() => setIsImgError(true)}
    />
  );
}
