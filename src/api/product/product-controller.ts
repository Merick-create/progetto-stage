import {Response,Request,NextFunction} from 'express';
import {creaprodotto,getProdotti,getProductByName,GetById} from './product-service';
import { ProductDto,AddProductDTO, OptionalDTO } from './product-DTO';
import { TypedRequest } from '../../lib/typed-request.interface';
import { Types } from 'mongoose';
import { ProductEntity } from './product-entity';

export const getlist = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const listaFiltrata = await getProdotti();
    response.json(listaFiltrata);
  } catch (err) {
    console.error(err);
    response.status(404).json({ error: 'Lista non trovata' });
  }
};

export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.params['id'];
    const atleta = await GetById(new Types.ObjectId(id));

    if (!atleta) {
       response.status(404).json({ error: 'Atleta non trovato' });
    }

    response.json(atleta);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Errore durante il recupero dell\'atleta' });
  }
};

export const add = async (
  request: TypedRequest<AddProductDTO>,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description, quantity, img } = request.body;

    const nuovoProdotto: ProductEntity = {
      name,
      price,
      description,
      quantity,
      img,
    };

    const prodottoAggiunto = await creaprodotto(nuovoProdotto);

    response.status(201).json(prodottoAggiunto);
  } catch (err) {
    console.error(err);
    response.status(400).json({ error: 'Errore durante l\'aggiunta dell\'atleta' });
  }
};

export const getByname = async (
  request: TypedRequest<unknown, OptionalDTO>,
  response: Response,
  next: NextFunction
) => {
  try {
    const results = await getProductByName(request.query);
    response.json(results || []); 
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Errore nella ricerca' });
  }
};

