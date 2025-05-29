import { TypedRequest } from "../../lib/typed-request.interface";
import {Request,Response,NextFunction} from "express"
import { AddCartDTO, UpdateCartQuantityDTO } from "./cart-DTO";
import { CartEntity } from "./cart-entity";
import { addToCart,getCart, removeFromCart, update } from "./cart-service";
import { GetById } from "../product/product-service";

export const add=async (req:TypedRequest<AddCartDTO>,res:Response,next:NextFunction)=>{
    const {productId,quantity} =req.body;
    const userId=req.user?.id!;

    const checkProduct=await GetById(productId)
    if (!checkProduct) {
        res.status(404).json({
            success: false,
            message: "Prodotto non trovato"
        });
    }

    const adding:CartEntity={
        product:productId,
        quantity,
        userId
    }

    const aggiunti=await addToCart(adding)
}


export const showCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id!;
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
        const userId = req.user?.id!;

        const updated = await update(id, { quantity }, userId);
        if (!updated) {
            res.status(404).json({
                success: false,
                message: "Elemento del carrello non trovato"
            });
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
        const userId = req.user?.id!;

        const removed = await removeFromCart(id, userId);
        if (!removed) {
            res.status(404).json({
                success: false,
                message: "Elemento del carrello non trovato"
            });
        }

        res.json(removed);
    } catch(err) {
        next(err);
    }
}