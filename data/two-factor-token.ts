import { prisma } from "@/lib/Prisma";

export const getTowFactorTokenByToken = async (token:string)=>{
    try{
        const twoFactorToken= await prisma.twoFactorToken.findUnique({
            where:{token}
        })

        return twoFactorToken;
    }catch{
        return null;
    }
}
export const getTowFactorTokenByEmail = async (email:string)=>{
    try{
        const twoFactorToken= await prisma.twoFactorToken.findFirst({
            where:{email}
        })

        return twoFactorToken;
    }catch{
        return null;
    }
}