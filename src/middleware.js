import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("t")?.value; 

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = jwt.decode(token);

  if (decoded.user_type === "Admin") {
    if (request.nextUrl.pathname.startsWith("/teacher") || request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/admin", request.url)); 
    }
  } 

  if (decoded.user_type === "Student") {
    if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/teacher")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (decoded.user_type === "Teacher") {
    if (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/teacher", request.url));
    }
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/"], 
};
