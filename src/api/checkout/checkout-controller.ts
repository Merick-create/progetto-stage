import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.entity';
import { confirmCheckout, createCheckout, destroyCheckout, getCheckOut } from './checkout-service';
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


export const deleteBill=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId = (req.user as User).id!;
        const createdCheckout=await destroyCheckout(new Types.ObjectId(userId))
        res.status(200)
        res.json(createdCheckout)
    }catch (err:any){
        next(err)
    }
}

export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as User).id!;
    const result = await confirmCheckout(new Types.ObjectId(userId));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
