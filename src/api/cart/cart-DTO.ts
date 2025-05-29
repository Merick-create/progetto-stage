import { Transform } from "class-transformer";
import { IsInt, IsMongoId, Min } from "class-validator";
import { Types } from "mongoose";


export class AddCartDTO {
    @IsMongoId()
    @Transform(({ value }) => new Types.ObjectId(value), { toClassOnly: true })
    productId: Types.ObjectId;
    
    @IsInt()
    @Min(1)
    quantity: number;
}


export class UpdateCartQuantityDTO{
    @IsInt()
    @Min(1)
    quantity:number
}