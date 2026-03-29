import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/api.js";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!JWT_SECRET) {
        res.status(500).json({ error: "Server configuration error: JWT_SECRET is not defined" });
        return;
    }

    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            username: string;
        };

        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
};
