import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user";
import bcrypt from 'bcryptjs' 

import Github from"next-auth/providers/github";
import Google from"next-auth/providers/google";


export default {
     providers:[
        //to allow dangerous linking which means sign in  with google and gitub with the same email adress 
        //we should  allowDangerousEmailAccountLinking down there and go to schemas and do two changes
        //Solution: Remove @unique from userId in Accoun schema
        //   in User Schema  // ❌ Changed from `String?` to `String`


        Google({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // allowDangerousEmailAccountLinking:true,
        }),
        Github({
            clientId : process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            // allowDangerousEmailAccountLinking:true,
        }),
        Credentials({
            async authorize(credentials){
                const validatedFields = LoginSchema.safeParse(credentials);
                
                if(validatedFields.success){
                    const {email , password} =validatedFields.data;     

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if(passwordMatch) return user;
                }
                return null;
            }
})] } satisfies NextAuthConfig