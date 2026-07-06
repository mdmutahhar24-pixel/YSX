'use server';

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function LogIn(_prevState: { error: string } | null, formData: FormData ) {
    const { error } = await auth.signIn.email({
        email: formData.get("email") as string,
        password: formData.get("password") as string
    });

    if (error) {
        return { error: error.message || "Log In failed. Please try again later" }
    }

    redirect('/');
}