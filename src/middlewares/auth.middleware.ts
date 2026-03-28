import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/api.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    if (!JWT_SECRET) {
        res.status(500).json({ error: "Server configuration error: JWT_SECRET is not defined" });
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized: Invalid token format" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: string, username: string };
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
};
