import { Types } from "mongoose";

export type CartEntity={
    product:Types.ObjectId;
    quantity:number;
    userId:string;
}