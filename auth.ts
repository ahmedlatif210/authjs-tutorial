import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"


import authConfig from "@/auth.config"
import { prisma } from "@/lib/Prisma"
import { getUserById } from "./data/user"
import  { type DefaultSession } from "next-auth"
import { User } from "@auth/core/types";
import { JWT } from "@auth/core/jwt";
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { redirect } from "next/navigation"
import { getAccountByUserId } from "./data/account"



// to add typescript to user inside session
//extend the existing session , user and add a specific field that you want
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      isTwoFactorEnabled:boolean;
      isOAuth:boolean;
    } & DefaultSession["user"]
  }
}

 


 
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages:{
    signIn: "/auth/login",
    error: "/auth/error",
  },
    events:{
      //thats to give an emailVerified to who sign in with OAuth 
      async linkAccount ({user}){
        await prisma.user.update({
          where:{id : user.id},
          data:{emailVerified: new Date()}
        })
      }
    },
    callbacks:{
      async signIn({user,account}){
        //allow OAuth without email verification 
        if(account?.provider !== "credentials") return true;

        if(!user.id) return false;

        const existingUser = await getUserById(user.id );

        //prevent sign in without email verification
        if(!existingUser?.emailVerified) return false;
        
        // add 2FA check
        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

          if(!twoFactorConfirmation) return false; 

          //delete two factor confirmation for next sign in
          await prisma.twoFactorConfirmation.delete({
            where:{id:twoFactorConfirmation.id}
          })
        }

        return true;
      },


      async session({token,session}){
        if(token.sub && session.user){
          session.user.id= token.sub
        } 
        if(token.role && session.user){
          // session.user.role = token.role
          session.user.role = token.role as UserRole;
          
        }
        if(session.user){
          // session.user.role = token.role
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
          //updating token and session by time 
          if(session.user){
            session.user.name=token.name;
            session.user.email=token.email as string;
            session.user.isOAuth=token.isOAuth as boolean
          }          
        }
        return session;
      }
      ,async jwt({token}){
        if(!token.sub) return token;
        
        const existingUser = await getUserById(token.sub);
        
        if(!existingUser) return token;

        const existingAccount= await getAccountByUserId(existingUser.id)



        //updating token and session by time 
        token.isOAuth =!!existingAccount;
        token.name=existingUser.name
        token.email=existingUser.email
        
        token.role = existingUser.role;

        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

        return token
      }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig, 
  })