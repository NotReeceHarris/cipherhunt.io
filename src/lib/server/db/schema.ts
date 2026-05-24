import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

export const solved = sqliteTable('solved', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	cipherId: integer('cipher_id').notNull()
		.notNull(),
		
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	cipherDuration: text({ enum: ["daily", "weekly", "monthly"] }).notNull(),
	cipherStartDate: integer({ mode: 'timestamp_ms' }).notNull(),
	solvedAt: integer({ mode: 'timestamp_ms' }).notNull(),
	
});

export * from './auth.schema';
