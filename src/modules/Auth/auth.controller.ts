import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";
import { JWT_TOKEN_LIFE_MS } from "../../constants/api.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { user, token } = await registerUser(req.body);
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: JWT_TOKEN_LIFE_MS
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { user, token } = await loginUser(req.body);
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: JWT_TOKEN_LIFE_MS
        });

        res.json(user);
    } catch (error) {
        res.status(401).json({ error });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: "Logged out successfully" });
};
