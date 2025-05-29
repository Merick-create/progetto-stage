import { ProductEntity } from './product-entity';
import { ProductModel } from './product-model';
import { OptionalDTO, ProductDto } from './product-DTO';
import { Types } from 'mongoose';

export type QueryProduct= ProductDto;
export async function creaprodotto(data: { name, price, description, quantity, img }): Promise < ProductEntity > {
    const prodotto = new ProductModel(data);
    return await prodotto.save();
}

export async function getProdotti(): Promise < ProductEntity[] > {
    return await ProductModel.find().populate('_id').exec();
}

export async function getProductByName(query:OptionalDTO): Promise < ProductEntity[] > {

    const prodotti = await ProductModel.find({
        name: [{ nome: { $exists: true } },
        { name: { $ne: null } },
        { name: { $ne: "" } }]
    });
    return prodotti;
}

export async function GetById(id:Types.ObjectId):Promise<ProductEntity|null> {
    return ProductModel.findById(id);
}

