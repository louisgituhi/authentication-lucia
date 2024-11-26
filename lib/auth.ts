import { Lucia } from "lucia";
import adapter from "./adapter";
import { cache } from "react";
import { cookies } from "next/headers";
import { roleEnums } from "./schema";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			role: attributes.role
		}
	}
});

export const validateRequest = cache(async () => {
	const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
	
	if (!sessionId) return {
		user: null,
		session: null,
	};
	const { user, session } = await lucia.validateSession(sessionId);
	
	try {
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		}
	} catch {

	}
	return {
		user,
		session
	};
})

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes
	}

	interface DatabaseUserAttributes {
		id: string,
		role: (typeof roleEnums.enumValues)[number]
	}
}