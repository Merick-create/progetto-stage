import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.entity';
import { createCheckout, getCheckOut } from './checkout-service';
import { Types } from 'mongoose';

export const bill=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = (req.user as User).id!;
        const checkout=await getCheckOut(new Types.ObjectId(userId))

        res.status(200)
        res.json(checkout)
    }catch (err:any){
        next(err)
    }
}

export const createBill=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = (req.user as User).id!;
        const createdCheckout=await createCheckout(new Types.ObjectId(userId))
        res.status(200)
        res.json(createdCheckout)
    }catch (err:any){
        next(err)
    }
}