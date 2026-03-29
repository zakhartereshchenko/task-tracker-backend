import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createNewUser, getUserById, getUserByUsername } from "../Users/user.service.js";
import { LoginData } from "./auth.types.js";
import { JWT_SECRET, JWT_TOKEN_LIFE_DAYS } from "../../constants/api.js";
import { UserData } from "../Users/user.types.js";

export const registerUser = async (data: LoginData) => {
    const { username, password } = data;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        throw new Error("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createNewUser({
        username,
        password: hashedPassword
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, {
        expiresIn: `${JWT_TOKEN_LIFE_DAYS}d`
    });

    const { username: createdUsername, id } = newUser;
    return { user: { username: createdUsername, id } as UserData, token };
};

export const loginUser = async (data: LoginData) => {
    const { username, password } = data;

    const user = await getUserByUsername(username);

    if (!user) {
        throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid username or password");
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: `${JWT_TOKEN_LIFE_DAYS}d`
    });

    const { username: foundUsername, id } = user;
    return { user: { username: foundUsername, id } as UserData, token };
};

export const checkUserExists = async (data: UserData) => {
    const user = await getUserById(data.id);
    if (!user) {
        throw new Error("User not found");
    }
    return { username: user.username, id: user.id } as UserData;
}
