import { pgTable, serial, text, varchar, integer, date } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    phone: varchar('phone', { length: 256 }),
    email: varchar('email', { length: 256 }),
    role: text('role', { enum: ['admin', 'user'] }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
})

// Schema for inserting a user - can be used to validate API requests
// Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
export const insertUserSchema = createInsertSchema(users, {
    id: (schema) => schema.id.positive(),
    email: (schema) => schema.email.email(),
    role: z.enum(['admin', 'user']),
    password: (schema) => schema.password.min(5),
});

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);

export type User = z.infer<typeof selectUserSchema>; // return type when queried
export type NewUser = z.infer<typeof insertUserSchema>; // input type when inserting

export const books = pgTable('books', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    title: text('title'),
    author: text('author'),
    isbn: varchar('isbn', { length: 256 }),
    published_date: date('published_date'),
})

export const insertBookSchema = createInsertSchema(books, {
    id: (schema) => schema.id.positive(),
    user_id: (schema) => schema.user_id.positive(),
    published_date: (schema) => schema.published_date.min(new Date(0).valueOf()),
});

export const selectBookSchema = createSelectSchema(books);

export type Book = z.infer<typeof selectBookSchema>;
export type NewBook = z.infer<typeof insertBookSchema>;