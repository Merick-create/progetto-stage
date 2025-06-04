import { Types } from "mongoose"

export type OrderEntity={
    id:Types.ObjectId;
    id_checkout:Types.ObjectId;
    created_at:Date;
}