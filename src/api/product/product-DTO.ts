import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {Types} from 'mongoose';

export class ProductDto{
    @IsString()
    name:string;

    @IsNumber()
    price:number;
}
export class AddProductDTO{
    @IsMongoId()
    id_categoria;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsNumber()
    price:number;
   

    @IsNotEmpty()
    @IsString()
    description:string;

    @IsNumber()
    quantity:number;
    
    @IsString()
    img:string;
}

export class OptionalDTO{
    name?:string;
}