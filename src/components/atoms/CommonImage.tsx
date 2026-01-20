"use client";
import Image, { type ImageProps } from "next/image";

export interface CommonImageProps extends Omit<ImageProps, "src" | "alt"> {
  alt: string;
  src: ImageProps["src"];
}

export default function CommonImage({
  alt,
  src,
  fill,
  width,
  height,
  className,
  sizes,
  ...rest
}: CommonImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      {...(!fill && { width, height })}
      className={className}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      {...rest}
    />
  );
}
