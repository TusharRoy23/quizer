// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/quiz', '/result', '/generated', '/search'];
const publicPaths = ['/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('accessToken')?.value;
    console.log(`Middleware: Path=${pathname}, Token=${token || 'none'}, URL=${request.url}`);

    // Skip internal Next.js requests and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/_vercel') ||
        pathname.startsWith('/api/_next') ||
        pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$/) ||
        request.headers.get('x-middleware-preflight') ||
        request.headers.get('x-nextjs-data')
    ) {
        console.log('Middleware: Skipping for', pathname);
        return NextResponse.next();
    }

    // Skip public paths
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
    console.log('Middleware: IsPublicPath=', isPublicPath);
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
    console.log('Middleware: IsProtectedRoute=', isProtectedRoute);

    // Redirect to login if protected and no token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
        loginUrl.searchParams.set('redirect', pathname);
        console.log('Middleware: Redirecting to', loginUrl.toString());
        return NextResponse.redirect(loginUrl);
    }

    // Prevent caching for protected routes
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
}

export const config = {
    matcher: [
        '/quiz/:path*',
        '/result/:path*',
        '/generated/:path*',
        '/search/:path*',
        '/quiz',
        '/result',
        '/generated',
        '/search',
    ],
};