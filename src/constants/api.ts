export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_TOKEN_LIFE_DAYS = 7;

export const JWT_TOKEN_LIFE_MS = JWT_TOKEN_LIFE_DAYS * 24 * 60 * 60 * 1000;

export const PORT = process.env.PORT;

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN