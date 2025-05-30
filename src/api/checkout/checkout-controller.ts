import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.entity';
import { createCheckout, getCheckOut } from './checkout-service';

export const bill=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = (req.user as User).id!;
        const checkout=await getCheckOut(userId)

        res.status(200)
        res.json(checkout)
    }catch (err:any){
        next(err)
    }
}

export const createBill=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = (req.user as User).id!;
        const createdCheckout=await createCheckout(userId)
        res.status(200)
        res.json(createdCheckout)
    }catch (err:any){
        next(err)
    }
}