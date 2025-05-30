import {Types} from "mongoose"
export type checkoutEntity={
    userId:Types.ObjectId,
    obj:[{
        productId:Types.ObjectId,
        quantity:number,
        price:number
    }]
}