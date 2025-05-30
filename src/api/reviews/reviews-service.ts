import { ReviewsEntity } from './reviews-entity';
import { ReviewsModel } from './reviews-model';
import { AddReviewsDTO, DeleteReviewsDTO, UpdateReviewsDTO } from './reviews-DTO';
import { Types } from 'mongoose';

export async function createReview(data: AddReviewsDTO): Promise<ReviewsEntity> {
  const review = new ReviewsModel(data);
  return await review.save();
}

export async function getAllReviews(): Promise<ReviewsEntity[]> {
  return ReviewsModel.find()
    .populate('user_id')
    .populate('product_id')
    .exec();
}

export async function getReviewById(id: Types.ObjectId): Promise<ReviewsEntity | null> {
  return ReviewsModel.findById(id)
    .populate('user_id')
    .populate('product_id')
    .exec();
}

export async function updateReview(dto: UpdateReviewsDTO): Promise<ReviewsEntity | null> {
  return ReviewsModel.findOneAndUpdate(
    { _id: dto.id, user_id: dto.user_id, product_id: dto.product_id },
    dto,
    { new: true },
  ).exec();
}

export async function deleteReview(dto: DeleteReviewsDTO): Promise<boolean> {
  const result = await ReviewsModel.deleteOne({
    _id: dto.id,
    user_id: dto.user_id,
    product_id: dto.product_id,
  });
  return result.deletedCount === 1;
}