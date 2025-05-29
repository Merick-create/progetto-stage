import { IsNumber, IsString } from 'class-validator';
import {Types} from 'mongoose';

export class ProductDto{
    @IsString()
    name:string;

    @IsNumber()
    price:number;
}