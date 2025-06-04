import { ProductEntity } from './product-entity';
import { ProductModel } from './product-model';
import { OptionalDTO, ProductDto } from './product-DTO';
import { Types } from 'mongoose';

export type QueryProduct= ProductDto;
export async function creaprodotto(data: { id_categoria,name, price, description, quantity, img }): Promise < ProductEntity > {
    const prodotto = new ProductModel(data);
    return await prodotto.save();
}

export async function getProdotti(): Promise < ProductEntity[] > {
    return await ProductModel.find().populate('_id').exec();
}

export async function getProductByName(query: OptionalDTO): Promise<ProductEntity[]> {
  const { name } = query;

  if (!name) return [];

  const prodotti = await ProductModel.find({
    name: {
      $regex: name,
      $options: "i"
    },
    $and: [
      { name: { $exists: true } },
      { name: { $ne: null } },
      { name: { $ne: "" } }
    ]
  });

  return prodotti;
}


export async function GetById(id:Types.ObjectId):Promise<ProductEntity|null> {
    return ProductModel.findById(id);
}

export async function updateProductQuantity(
  id: Types.ObjectId,
  quantity: number
): Promise<ProductEntity | null> {
  return ProductModel.findByIdAndUpdate(
    id,
    { $set: { quantity } },
    { new: true }
  );
}

