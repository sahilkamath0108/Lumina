import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/server'

export async function GET(request: Request) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:3000`

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('error', error)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${SITE_URL}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`http://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${SITE_URL}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${SITE_URL}/auth/error`)
}
