import { Request, Response } from "express";
import { getAllUsers, getUserById, createNewUser, updateUserById, deleteUserById } from "./user.service.js";
import { NewUser, UserFilters } from "./user.types.js";

export const getUser = async (req:Request, res:Response) => {
    try{
        const id = req.params.id as string
        
        const user = await getUserById(id)

        res.json(user)
    }catch(error){
        res.status(500).json({
            error
        })
    }
}

export const getUsers = async (req:Request, res:Response) => {
    try {
        const filters: UserFilters = {};
        if (req.query.username) filters.username = req.query.username as string;
        if (req.query.projectId) filters.projectId = req.query.projectId as string;

        const users = await getAllUsers(filters);

        res.json(users);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password }: NewUser = req.body;
        
        const newUser = await createNewUser({
            username,
            password
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export const updateUser = async (req:Request, res:Response) => {
    try{
        const id = req.params.id as string;
        const user = req.body;

        const updatedUser = await updateUserById(id, user)

        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ error });
    }
    
}

export const deleteUser = async (req:Request, res:Response) => {
    try{
        const id = req.params.id as string;

        const deletedUser = await deleteUserById(id)

        res.json(deletedUser)
    }catch(error){
        res.status(500).json({error})
    }
}