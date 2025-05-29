import { ProductEntity } from "../product/product-entity";
import { User } from "../user/user.entity";

export type CartItem = {
    id?: string;
    product: string | ProductEntity;
    quantity: number;
    user: string | User;
}

export type PopulatedCartItem = Omit<CartItem, 'product'> & {
    product: ProductEntity | null;
}