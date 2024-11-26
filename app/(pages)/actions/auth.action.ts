'use server'
import { signInSchema, signUpSchema } from "@/app/definations/type"
import { z } from "zod"
import { Argon2id } from "oslo/password"
import { generateId } from "lucia"
import { db } from "@/lib"
import { userTable } from "@/lib/schema"
import { lucia, validateRequest } from "@/lib/auth"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
    const hashedPassword = await new Argon2id().hash(values.password)
    const userId = generateId(15)

    try {
        await db
        .insert(userTable).values({
            id: userId,
            username: values.username,
            hashedPassword
        })
        .returning({
            id: userTable.id,
            username: userTable.username
        })

        // create session
        const session = await lucia.createSession(userId, {
            expiresIn: 60 * 60 * 24 * 30,
        });

        const sessionCookie = lucia.createSessionCookie(session.id);

        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

        return {
            success: true,
            data: {
                userId,
            }
        }
    } catch (error: any) {
        return {
            error: error?.message
        }
    }
}

export const signIn = async (values: z.infer<typeof signInSchema>) => {
    const existingUser = await db.query.userTable.findFirst({
        where: (table) => eq(table.username, values.username)
    })

    if (!existingUser?.hashedPassword) {
        return {
            error: "User not found",
        }
    }

    const isValidPassword = await new Argon2id().verify(
        existingUser.hashedPassword,
        values.password
    )

    if (!isValidPassword) {
        return {
            error: "Incorrect username or password",
        }
    }

    const session = await lucia.createSession(existingUser.id, {
        expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
        sessionCookie.name, 
        sessionCookie.value, 
        sessionCookie.attributes
    );

    return {
        success: "Logged in successfully"
    }

}

export const signOut = async () => {

    try {
        
        const {session} = await validateRequest()
    
        if (!session) {
            return {
                error: "Unauthorized",
            }
        }
    
        await lucia.invalidateSession(session.id)
    
        const sessionCookie = lucia.createBlankSessionCookie();
    
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

    } catch (error: any) {
        return {
            error: error?.message
        }
    }
}