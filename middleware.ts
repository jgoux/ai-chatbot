import { createMiddleware } from '@supabase/auth/next'
import { NextRequest } from 'next/server'

const supabaseAuthMiddleware = createMiddleware({
  isPublicPath: pathname =>
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth'),
  loginPath: '/login'
})

export async function middleware(request: NextRequest) {
  // @ts-expect-error type of request is incompatible because of npm link I guess
  return await supabaseAuthMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
