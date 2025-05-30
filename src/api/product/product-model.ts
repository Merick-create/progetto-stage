import { Schema,Types,Mongoose, model } from "mongoose";
import { ProductEntity } from "./product-entity";

const ProductSchema=new Schema<ProductEntity>({
    id_categoria:{type:Schema.Types.ObjectId,ref:'Categories',require:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    quantity:{type:Number,required:true},
    img:{type:String,required:true},
});
ProductSchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

export const ProductModel=model('Products',ProductSchema);  