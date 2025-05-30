import {Schema,model,Types}from 'mongoose';
import { CategoryEntity } from './category-entity';

export const CategorySchema=new Schema<CategoryEntity>({
    name:{type:String,require:true}
})

CategorySchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{

        delete ret.__v;
        return ret;
    }
});

export const CategoryModel=model('Categories',CategorySchema);