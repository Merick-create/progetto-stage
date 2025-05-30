import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import {createReview,getAllReviews,getReviewById,updateReview,deleteReview} from './reviews-service';
import { AddReviewsDTO, DeleteReviewsDTO, UpdateReviewsDTO } from './reviews-DTO';
import { ReviewsEntity } from './reviews-entity';
import { TypedRequest } from '../../lib/typed-request.interface';

export const getReviewsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il recupero delle recensioni' });
  }
};

export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params['id'];
    const review = await getReviewById(new Types.ObjectId(id));

    if (!review) {
      res.status(404).json({ error: 'Recensione non trovata' });
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante il recupero della recensione' });
  }
};

export const addReview = async (
  req: TypedRequest<AddReviewsDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewData: AddReviewsDTO = req.body;
    const review = await createReview(reviewData);
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Errore durante l\'aggiunta della recensione' });
  }
};

export const patchReviewHandler = async (
  req: TypedRequest<UpdateReviewsDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await updateReview(req.body);

    if (!updated) {
     res.status(404).json({ error: 'Recensione non trovata o non autorizzato' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Errore durante la modifica della recensione' });
  }
};

export const deleteReviewHandler = async (
  req: TypedRequest<DeleteReviewsDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await deleteReview(req.body);
    res.json({ deleted });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Errore durante l\'eliminazione della recensione' });
  }
};
