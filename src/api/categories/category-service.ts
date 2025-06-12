import { CategoryEntity } from './category-entity';
import { CategoryModel } from './category-model';
import { Types } from 'mongoose';

export async function creaCategoria(data: { name: string,img:string }): Promise<CategoryEntity> {
  const categoria = new CategoryModel(data);
  return await categoria.save();
}

export async function getCategorie(): Promise<CategoryEntity[]> {
  return await CategoryModel.find().exec();
}

export async function getCategoriaById(id: Types.ObjectId): Promise<CategoryEntity | null> {
  return await CategoryModel.findById(id).exec();
}