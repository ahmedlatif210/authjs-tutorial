/**
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [

    "/",
    "/auth/new-verification"
]

    
//the authRoutes are availables for logged out users
/**
 * An array of routes that are used for authentication
 * these routes will redirect logged in to /settings
 * @type {string[]}
 */
export const authRoutes=[
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
* @type {string}
 */
export const apiAuthPrefix ="/api/auth"


/**
* The default redirect path after login in 
* @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT='/settings'