// import { User } from "../../generated/prisma/index.js";
import { User } from "@prisma/client";

export type LoginData = Pick<User, "username" | "password">
