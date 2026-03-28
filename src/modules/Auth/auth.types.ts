import { User } from "../../generated/prisma/index.js";

export type LoginData = Pick<User, "username" | "password">