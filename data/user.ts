import { prisma } from "@/lib/Prisma";

//instead of calling the user by id or email every time 
//i made that file to just call the function
export const getUserByEmail =async(email : string)=>{
    try{
        const user = await prisma.user.findUnique({where:{email}});
        return user;
    }catch {
        return null;
        
    }
}

export const getUserById =async(id : string)=>{
    try{
        const user = await prisma.user.findUnique({where:{id}});
        return user;
    }catch {
        return null;
        
    }
}