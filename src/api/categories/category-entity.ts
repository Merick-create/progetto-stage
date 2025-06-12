import { Types } from "mongoose"

export type CategoryEntity={
    id:Types.ObjectId;
    name:string;
    img: string;
}