import { Types } from "mongoose"

export type ReviewsEntity = {
  id: Types.ObjectId;
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
  rating: number;
  content?: string;
  created_at: Date;
};
