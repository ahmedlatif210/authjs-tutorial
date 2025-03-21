'use server';

import { signOut } from "@/auth";

export const logout = async()=>{
    //if i want to make any  server stuff maybe clearing information or even deleteing the user
    await signOut();
}