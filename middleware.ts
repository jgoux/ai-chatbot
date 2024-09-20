import {
  supabaseMiddleware,
  createRouteMatcher
} from '@supabase-labs/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login(.*)', '/signup(.*)'])

export default supabaseMiddleware(
  (auth, request) => {
    if (!isPublicRoute(request)) {
      auth().protect(has => has({ user_metadata: { roles: ['admin'] } }))
    }

    if (isPublicRoute(request) && auth().user) {
      auth().redirect('/')
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
