// app/middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token'); // Assuming token is stored in cookies
  
  // If token is missing and the user is trying to access the main page, redirect to login
  if (!token && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If token is present and the user is trying to access the login page, redirect to main
  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/main', req.url));
  }
}

export const config = {
  matcher: ['/main', '/login'], // Define the paths to match for middleware
};
