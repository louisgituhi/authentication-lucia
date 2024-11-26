import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./supabase",
    schema: "./lib/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    }
})