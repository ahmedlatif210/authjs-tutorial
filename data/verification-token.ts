import { prisma } from "@/lib/Prisma"

export const getVerificationTokenByToken = async(token : string)=>{
    try{
        const verificationToken = await prisma.verificationToken.findUnique({
            where:{token}
        })

        return verificationToken
    }catch{
        return null
    }
}

export const getVerificationTokenByEmail = async(email : string)=>{
    try{
        const verificationToken = await prisma.verificationToken.findFirst({
            where:{email}
        })

        return verificationToken
    }catch{
        return null
    }
}

//after that we generate a lib file called --token.ts-- which is gonna be used to generate these tokens and also removing existing token