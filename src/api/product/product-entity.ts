import { Types } from "mongoose";

export type ProductEntity={
    id?:Types.ObjectId;
    name:string;
    price:number;
    description:string;
    quantity:number;
    img:string;
}