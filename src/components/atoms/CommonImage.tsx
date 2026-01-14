import Image from "next/image";
import { useState } from "react";

interface ImageProps {
  alt: string;
  src: string;
  width: number;
  height: number;
  className?: string;
}

export default function CommonImage({
  alt,
  src,
  height,
  width,
  className,
}: ImageProps) {
  const [isImgError, setIsImgError] = useState<boolean>(false);

  return (
    <Image
      src={src}
      alt={alt}
      className={className && className}
      width={width}
      height={height}
      sizes="100vw"
      style={{
        width: "100%",
        height: isImgError ? height : "auto",
      }}
      onError={() => setIsImgError(true)}
    />
  );
}
