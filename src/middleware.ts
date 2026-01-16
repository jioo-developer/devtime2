import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  console.log("🚨 Middleware is processing:", pathname);

  const historyPath = `${pathname}${search}`;
  console.log("history Path : ", historyPath);

  const publicPaths = ["/auth", "/ui"]; // 비로그인시에도 접근 가능 경로
  const protectedPaths = ["/main"]; // 로그인시에만 접근 가능 경로

  const token = request.cookies.get("authToken")?.value;

  // 현재 pathName이 로그인시에만 접근 가능 경로에 포함되있는 지 체크
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 현재 pathName이 로그인시 접근하면 안되는 경로 인지 체크
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  //비로그인 상태에서 보호된 경로로 접근 시 회원가입 페이지로 리디렉션
  if (!token && (isProtectedPath || pathname === "/")) {
    console.log("Redirecting to /auth");
    console.log("----------------------------------");

    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("redirect", historyPath);

    return NextResponse.redirect(authUrl);
  }

  if (token && isPublicPath) {
    console.log("Redirecting to history back or /");
    console.log("----------------------------------");

    const redirect = request.nextUrl.searchParams.get("redirect");

    if (redirect) {
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|/public|api/).*)",
  ],
};
