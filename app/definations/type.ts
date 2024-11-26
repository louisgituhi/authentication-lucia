import { z } from "zod"

export const signUpSchema = z.object({
    username: z.string().min(4).max(50),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Password must be atleast 8 characters long" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const signInSchema = z.object({
    username: z.string().min(4).max(50),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})