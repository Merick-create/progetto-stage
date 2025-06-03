import {Schema,model,Types} from 'mongoose';
import { OrderEntity } from './order-entity';

const OrderSchema=new Schema<OrderEntity>({
    id_checkout:{type:Schema.Types.ObjectId,ref:'Checkout', require:true},
    created_at:{type:Date,require:true}
})

OrderSchema.set('toJSON',{
    virtuals:true,
    transform:(_,ret)=>{
        delete ret.__v;
        return ret;
    }
});

export const OrderModel=model('Orders',OrderSchema);