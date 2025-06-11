import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
import { UserModel } from "./user.model";
import { User } from "./user.entity";
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



export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as User).id!;
        const { picture } = req.body;

        if (!userId || typeof picture !== 'string') {
            res.status(400).json({ error: 'Invalid data' });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { picture },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user picture:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
