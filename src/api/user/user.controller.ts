import { Request, Response, NextFunction } from "express";
import UserService from "./user.service";
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
        console.error('Errore nel controller filtered:', error);

        const statusCode = error.message === 'Invalid role' ? 400 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};



export const updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUser = req.user as User; 
        const userId = currentUser?.id;

        if (!userId) { 
            res.status(401).json({ error: 'User not authenticated' });
        }
        
        const updates = req.body; 
        
        
        const updatedUser = await UserService.updateUser(userId!, updates); 


        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser); 
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        const statusCode = error.message.includes('Invalid') ? 400 : 500;
        res.status(statusCode).json({ error: error.message || 'Failed to update user profile' });
    }
};

