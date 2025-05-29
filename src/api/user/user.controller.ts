import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
export const me = async (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    
    res.json(req.user);
}

export const filtered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.query;

        const users = await UserService.getUsersByRole(role as string);
        res.status(200).json(users);
    } catch (error: any) {
        console.error('Error in filtered controller:', error);

        const statusCode = error.message === 'Invalid role' ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};
