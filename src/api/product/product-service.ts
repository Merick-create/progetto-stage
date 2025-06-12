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

export async function getProductsByCategory(categoryId: string): Promise<ProductEntity[]> {
  return await ProductModel.find({ id_categoria: categoryId }).exec();
}

export async function getFilteredProducts(params: any) {
  const {
    categories,
    priceMin,
    priceMax,
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    itemsPerPage = 9,
  } = params;

  const query: any = {};

  if (categories) {
    const categoryArray = categories.split(",");
    query.id_categoria = { $in: categoryArray };
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = parseFloat(priceMin);
    if (priceMax) query.price.$lte = parseFloat(priceMax);
  }

  const sortFields: any = {
    price: "price",
    name: "name",
  };

  const sortDirection = sortOrder === "desc" ? -1 : 1;
  const sortField = sortFields[sortBy] || "name";

  const products = await ProductModel.find(query)
    .sort({ [sortField]: sortDirection })
    .skip((+page - 1) * +itemsPerPage)
    .limit(+itemsPerPage)
    .populate("id_categoria");

  const total = await ProductModel.countDocuments(query);

  return {
    products,
    total,
    page: +page,
    itemsPerPage: +itemsPerPage,
  };
}