import authConfig from "./auth.config"
import NextAuth from "next-auth"

import {
  DEFAULT_LOGIN_REDIRECT,apiAuthPrefix,publicRoutes,authRoutes
} from '@/routes'


const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req: NextRequest) {
  //we have to make it that order below
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)


    if(isApiAuthRoute){
      return null
    }

    if(isAuthRoute){
      if(isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl))
      }
      return null;
    }
    
    if(!isLoggedIn && !isPublicRoute){

      let callbackUrl=nextUrl.pathname;
      if(nextUrl.search){
        callbackUrl +=nextUrl.search
      }

      const encodedCallbackUrl= encodeURIComponent(callbackUrl);



      return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`,nextUrl))
    }

    return null;
})




// Optionally, don't invoke Middleware on some paths
//we will use another regular expression from clerck site to invoke some paths like
export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
            ],

}

