"use server"

import { lucia, validateRequest } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export async function Logout() {

    const { session } = await validateRequest()

    if (!session) {
        throw new Error("Unauthorized")
    }

    // for removing the exisiting session and logout the user
    await lucia.invalidateSession(session.id)
    const sessionsCookie = lucia.createBlankSessionCookie()

    cookies().set(
        sessionsCookie.name,
        sessionsCookie.value,
        sessionsCookie.attributes,
    )


    return redirect('/login')
    // completed the backend logic
    
}