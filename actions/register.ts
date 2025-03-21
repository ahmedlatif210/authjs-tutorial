"use server";

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { RegisterSchema } from '@/schemas';
import { prisma } from '@/lib/Prisma';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values:z.infer<typeof RegisterSchema>)=>{
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid fields"};
    }
    //after confirming that the fields aren't invalid 
    //we have to extract the validated fields to usw them 
    const{email , password, name } = validatedFields.data
    //and then hash the pass with bcrypt
    const hashPassword = await bcrypt.hash(password,10)

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return{error:"Email already in use"}
    }

    await prisma.user.create({
        data:{
            name,
            email,
            password : hashPassword,
        }
    })

    const verificationToken = await generateVerificationToken(email)

    //TODO send verification token email
    await sendVerificationEmail(verificationToken.email,verificationToken.token)

    return {success:"Confirmation email sent"}
}