import { Request, Response } from "express";
import { registerUser, loginUser, checkUserExists } from "./auth.service.js";
import { JWT_TOKEN_LIFE_MS } from "../../constants/api.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { user, token } = await registerUser(req.body);
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: JWT_TOKEN_LIFE_MS
        });

        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message,
            });
        }

        return res.status(400).json({
            error: "Unknown error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { user, token } = await loginUser(req.body);
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: JWT_TOKEN_LIFE_MS
        });

        res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: error.message,
            });
        }

        return res.status(400).json({
            error: "Unknown error",
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
    });
    res.json({ message: "Logged out successfully" });
};

export const authenticate = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const result = await checkUserExists(user)
        res.json(result);
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}