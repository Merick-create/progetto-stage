import { Schema,Types,model, } from "mongoose";
import { ReviewsEntity } from "./reviews-entity";


const ReviewsSchema = new Schema<ReviewsEntity>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String },
  created_at: { type: Date, default: Date.now },
});


ReviewsSchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{
        delete ret.__v;
        return ret;
    }
});

export const ReviewsModel=model('Reviews',ReviewsSchema);