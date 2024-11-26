import { pgRole, integer, pgEnum, pgTable, text, timestamp, pgPolicy, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm";

// Define roles
export const adminRole = pgRole("admin");
export const sdsRole = pgRole('sds', { createRole: true, inherit: true });
export const supervisorRole = pgRole('supervisor', { createRole: true, inherit: true });
export const receiverRole = pgRole('receiver', { createRole: true, inherit: true });

export const roleEnums = pgEnum("role_enum", [
	"admin", 
	"supervisor", 
	"receiver", 
	"sds",
]);

export const branchesTable = pgTable("branches", {
	id: integer("id").primaryKey(),
	branchName: text("branch_name").notNull().unique(),
	branchCode: text("branch_code").notNull().unique()
}).enableRLS();

export const userTable = pgTable("user", {
	id: text("id").unique().primaryKey(),
    username: text("username").notNull().unique(),
    hashedPassword: text("hashed_password"),
	roles: roleEnums().notNull().default("sds"),
	branchName: text("branch_name").references(() => branchesTable.branchName)
}, (t) => [
	pgPolicy('policy', {
		as: "permissive",
		to: adminRole,
		for: "all",
		using: sql``,
		withCheck: sql``
	})
]).enableRLS();

export const sessionTable = pgTable("session", {
	id: text("id").unique().primaryKey(),
	userId: text("user_id").notNull().references(() => userTable.id),
	expiresAt: timestamp("expires_at", { withTimezone: true,mode: "date"}).notNull()
}).enableRLS();

export const faultyAccounts = pgTable("faulty_accounts", {
	id: integer("id").unique().primaryKey(),
	accountName: text("account_name").notNull(),
	accountNumber: integer("account_number").notNull(),
	branchName: text("branch_name").references(() => branchesTable.branchName),
	returnedBy: text("returned_by").references(() => userTable.username),
	returnToBranch: date("return_to_branch").notNull().defaultNow(),
	receivedAtOperations: date("return_to_operations").defaultNow()
}).enableRLS();