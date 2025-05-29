import { Schema,Types,Mongoose, model } from "mongoose";
import { ProductEntity } from "./product-entity";

const ProductSchema=new Schema<ProductEntity>({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    
});
ProductSchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const AllenamentiModel=model('allenamenti',AllenamentiSchema);  