"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const PUBLIC_PATH_PREFIXES = ["/login", "/auth"];

function isPublicPath(pathname: string | null): boolean {
  const path = pathname ?? "/";
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);

  // 공개 페이지에서는 헤더를 렌더링하지 않음
  if (isPublic) return null;

  return <Header />;
}
