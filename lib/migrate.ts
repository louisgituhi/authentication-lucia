import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const migrationClient = postgres(process.env.DATABASE_URL as string, {
	max: 1,
});

async function migrationFn() {
	await migrate(drizzle(migrationClient), {
		migrationsFolder: "./supabase",
	});
	await migrationClient.end();
}

migrationFn()
	.then(() => console.log("Migration  successfull"))
	.catch((err) => console.error("Error migration failed: ", err.message));