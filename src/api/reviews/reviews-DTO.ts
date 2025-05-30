import { Types } from "mongoose";

export class AddReviewsDTO{
    user_id:Types.ObjectId;
    product_id:Types.ObjectId;
    rating:number;
    content?:string;
    created_at:Date;
}

export class DeleteReviewsDTO{
    id:Types.ObjectId;
    user_id:Types.ObjectId;
}

export class UpdateReviewsDTO{
    id:Types.ObjectId;
    user_id:Types.ObjectId;
    rating:number;
    content?:string;
    created_at:Date;
}