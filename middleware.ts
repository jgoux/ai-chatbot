import { supabaseMiddleware, createRouteMatcher } from '@supabase/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login(.*)', '/signup(.*)'])

export default supabaseMiddleware(
  async (auth, request) => {
    const session = await auth()

    // protect all routes except public ones
    if (!isPublicRoute(request) && !session.user) {
      return session.redirectToSignIn()
    }

    // redirect to home if user is logged in and on public route
    if (isPublicRoute(request) && session.user) {
      return session.redirectToHome()
    }
  },
  {
    paths: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
