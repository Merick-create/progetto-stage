import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import {createReview,getAllReviews,getReviewById,updateReview,deleteReview} from './reviews-service';
import { AddReviewsDTO, DeleteReviewsDTO, UpdateReviewsDTO } from './reviews-DTO';
import { ReviewsEntity } from './reviews-entity';
import { TypedRequest } from '../../lib/typed-request.interface';
import { User } from '../user/user.entity';

export const getReviewsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productid;
    if (!Types.ObjectId.isValid(productId)) {
      res.status(400).json({ error: 'ID prodotto non valido' });
    }

    const reviews = await getAllReviews(new Types.ObjectId(productId));
    console.log(reviews)
    res.json(reviews);
  } catch (err) {
    console.error('Errore getReviewsList:', err);
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
    const productId = req.params.productid;
    const { rating, content } = req.body;
    const user_id = (req.user as User).id!;

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Il rating deve essere tra 1 e 5' });
    }

    const reviewData: AddReviewsDTO = {
      user_id: new Types.ObjectId(user_id),
      product_id: new Types.ObjectId(productId),
      rating,
      content,
      created_at: new Date(),
    };
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
    const id = req.params.id;
    const user_id = (req.user as User).id!;
    const { rating, content, created_at } = req.body;

    // Validazioni
    if (!Types.ObjectId.isValid(id) ) {
      res.status(400).json({ error: 'ID non valido' });
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Il rating deve essere tra 1 e 5' });
    }

    const updateDto: UpdateReviewsDTO = {
      id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(user_id),
      rating,
      content,
      created_at,
    };

    const updated = await updateReview(updateDto);

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
  req: TypedRequest<Partial<DeleteReviewsDTO>>, // id sarà in params, non nel body
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user_id = (req.user as User).id!;

    // Validazione ID
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID non valido' });
    }

    const deleteDto: DeleteReviewsDTO = {
      id: new Types.ObjectId(id),
      user_id: new Types.ObjectId(user_id),
    };

    const deleted = await deleteReview(deleteDto);
    if (!deleted) {
      res.status(404).json({ error: 'Recensione non trovata o non autorizzato' });
    }

    res.json({ deleted });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Errore durante l\'eliminazione della recensione' });
  }
};
