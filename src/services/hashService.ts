import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        throw new Error('Error comparing password with hash');
    }
}