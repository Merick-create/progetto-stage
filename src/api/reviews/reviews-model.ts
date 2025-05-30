import { Schema,Types,model, } from "mongoose";
import { ReviewsEntity } from "./reviews-entity";


const ReviewsSchema=new Schema<ReviewsEntity>({
    user_id:{type:Schema.Types.ObjectId,ref:'User',require:true},
    product_id:{type:Schema.Types.ObjectId,ref:'Products',required:true},
    rating:{type:Number,require:true},
    content:{type:String,require:true},
    created_at:{type:Date,require:true}
})  

ReviewsSchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{
        delete ret.__v;
        return ret;
    }
});

export const ReviewsModel=model('Reviews',ReviewsSchema);