"use server";
import * as z from 'zod'
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken ,generateTwoFactorToken } from '@/lib/token';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';
import { getTowFactorTokenByEmail } from '@/data/two-factor-token';
import { prisma } from '@/lib/Prisma';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const login = async (values:z.infer<typeof LoginSchema>,callbackUrl?:string | null)=>{
    const validatedFields = LoginSchema.safeParse(values);
    //check validatedFields
    if(!validatedFields.success){
        return {error:"Invalid fields"};
    }
    const {email ,password ,code} =validatedFields.data;
    
    const existingUser = await getUserByEmail(email)
    
    
    //check email
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error : "Email does not exist!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        await sendVerificationEmail(verificationToken.email,verificationToken.token)
        return {success : "Confirmation email sent!"}
    }

    // ✅ First, check if the password is correct before proceeding to 2FA

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return { error: "Wrong password!" };
    }
    // two factor confirmaion check
    if(existingUser.isTwoFactorEnabled && existingUser.email){

        if(code){
            //Verify the code
            const twoFactorToken = await getTowFactorTokenByEmail(existingUser.email);
            if(!twoFactorToken) return {error:"Invalid code!"};

            if(twoFactorToken.token !== code) return {error:"Invalid code!"};

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if(hasExpired) return{error : "Code expired!"};

            await prisma.twoFactorToken.delete({
                where:{id:twoFactorToken.id}
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            if(existingConfirmation){
                await prisma.twoFactorConfirmation.delete({
                    where: {id: existingConfirmation.id}
                })
            }

            await prisma.twoFactorConfirmation.create({
                data:{
                    userId : existingUser.id
                }
            })

        }else{

            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            
            await sendTwoFactorTokenEmail(twoFactorToken.email,twoFactorToken.token);
            
            return{twoFactor : true} 
        }

    }
    

    //we can do the  same to sign in with google just by doing another action and replace credentials with google or githup
    //but we will do it with another way
    //we will do it inside a client component without server actions => inside social page
    try{
        await signIn('credentials',{
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
        
        
        
    } catch(error ){
        if (error instanceof AuthError){
            switch (error.type){
                case "CredentialsSignin":
                    return {error :"Invalid credentials!!"}
                    default:
                        return {error:"Someting went wrong!"}
            }

        }
        throw error;
    }
}