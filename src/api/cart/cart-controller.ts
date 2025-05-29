import { Request, Response, NextFunction } from 'express';
import { GetById } from '../product/product-service';
import { CartItem } from './cart-entity';
import { addToCart, getCart, removeFromCart, update } from './cart-service';
import { TypedRequest } from '../../lib/typed-request.interface';
import { AddCartItemDTO, UpdateCartQuantityDTO } from './cart-DTO';
import { NotFoundError } from '../../errors/not-found.error';
import { User } from '../user/user.entity';
import { Types } from 'mongoose';


export const add = async (
    req: TypedRequest<AddCartItemDTO>, 
    res: Response, 
    next: NextFunction) => {
    try {
        const { productId, quantity } = req.body;
        const userId = (req.user as User).id!;

        const product = await GetById(new Types.ObjectId(productId));
        if (!product) {
            throw new Error('Not Found');
        }

        const toAdd: CartItem = {
            product: productId,
            quantity,
            user: userId
        };
        
        const added = await addToCart(toAdd);

        res.status(201);
        res.json(added);
    } catch (err: any) {
        next(err);
    }
}


export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as User).id!;
        const cart = await getCart(userId);

        res.json(cart);
    } catch(err) {
        next(err);
    }
}

export const updateQuantity = async (
    req: TypedRequest<UpdateCartQuantityDTO>,
    res: Response,
    next: NextFunction) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const userId = (req.user as User).id!;

        const updated = await update(id, { quantity }, userId);
        if (!updated) {
            throw new NotFoundError();
        }
        res.json(updated);
    } catch(err: any) {
        next(err);
    }
}

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req.user as User).id!;

        const removed = await removeFromCart(id, userId);
        if (!removed) {
            throw new NotFoundError();
        }

        res.json(removed);
    } catch(err) {
        next(err);
    }
}