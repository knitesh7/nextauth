import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname
    // console.log('path :',path)
    // const profileIdPresent = path.startsWith('/profile')?(path.split('/').length>2?true:false):false
    const isPublicPath = path === '/login' || path === '/signup' 
    const token = request.cookies.get('token')
    
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl))

    } else if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/profile',
        '/profile/:path*'
    ]
}

