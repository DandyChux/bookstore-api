import { NewUser, User, insertUserSchema, selectUserSchema, users } from "@models/schema";
import { comparePassword, hashPassword } from './hashService'
import drizzleDB from "@config/db.config";
import { eq } from "drizzle-orm";

export const createUser = async (newUser: NewUser): Promise<User> => {
    const hashedPassword = await hashPassword(newUser.password);
    
    const user = await drizzleDB.insert(users).values({ ...newUser, password: hashedPassword }).returning();

    return selectUserSchema.parse(user);
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const user = await drizzleDB.select({ email: users.email }).from(users).where(eq(users.email, email)).limit(1);

    return user ? selectUserSchema.parse(user) : null;
}

export async function validateUser(email: string, password: string): Promise<User | null> {
    const user = await findUserByEmail(email);

    // Check if user exists and password is correct
    if (user && await comparePassword(password, user.password)) {
        return user;
    }

    return null;
}