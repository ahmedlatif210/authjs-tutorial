//for trying  server actions  in my app 
//we did this and then go to the page to make a function using that action below and then for results
// thhat lib currentRole() used in both server actions and api routes

'use server'

import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client";

export const admin =async()=>{

    const role = await currentRole();

    if(role === UserRole.ADMIN){
        return{success:"Allowed Server Action!"}
    }
    return {error:"Forbidden Server Action!"}
}