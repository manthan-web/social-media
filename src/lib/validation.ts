// this would have all the schema for the data coming from the user and it would be used both for 
// backend and the frontend

import {z} from "zod"


const requiredString = z.string().trim().min(1, "Required")

export const SignUpSchema = z.object({
    email: requiredString.email("Invalid email address"),
    username: requiredString.regex(
        /^[a-zA-Z0-9_-]+$/,
        "Invalid username"
    ),
    password: requiredString.min(8, "Password must be at least 8 characters long"),
})


// this is the main thing that would be used across for validation
export type SignUpValues = z.infer<typeof SignUpSchema>


export const LoginSchema = z.object({
    username: requiredString,
    password: requiredString,
})

export type LoginValues = z.infer<typeof LoginSchema>