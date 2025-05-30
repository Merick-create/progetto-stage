import {Types} from "mongoose"
export type checkoutEntity={
    userId:string;
    obj:[{
        productId:Types.ObjectId,
        quantity:number,
        price:number
    }]
}