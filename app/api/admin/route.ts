//for trying  API Routes  in my app 
//we did this and then go to the page to make a fetch requeust
//it  Works in client & server components	

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await currentRole();

    if(role === UserRole.ADMIN){
        return new NextResponse(null,{status:200})
    }

    return new NextResponse(null,{status:403})
    
}