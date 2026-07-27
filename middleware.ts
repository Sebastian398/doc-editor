import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(

  function middleware(req) {

    const role = req.nextauth.token?.role

    const path =
      req.nextUrl.pathname

    // ADMIN
    if (
      path.startsWith('/admin')
    ) {

      if (
        role !== 'ADMIN'
      ) {

        return NextResponse.redirect(
          new URL(
            '/unauthorized',
            req.url
          )
        )
      }
    }

    // MANAGER + ADMIN
    if (

      path.startsWith('/documents') ||

      path.startsWith('/flows') ||

      path.startsWith('/dashboard') ||

      path.startsWith('/editor')

    ) {

      if (

        role !== 'ADMIN' &&
        role !== 'MANAGER'

      ) {

        return NextResponse.redirect(
          new URL(
            '/unauthorized',
            req.url
          )
        )
      }
    }

    return NextResponse.next()
  },

  {
    callbacks: {

      authorized: ({
        token,
      }) => !!token,

    },
  }

)

export const config = {

  matcher: [

    '/admin/:path*',

    '/documents/:path*',

    '/flows/:path*',

    '/dashboard/:path*',

    '/editor/:path*',

  ],

}