import {Response,Request,NextFunction} from 'express';
import {creaprodotto,getProdotti,getProductByName,GetById, updateProductQuantity,getProductsByCategory, getFilteredProducts} from './product-service';
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
      const prodotto = await GetById(new Types.ObjectId(id));

      if (!prodotto) {
        response.status(404).json({ error: 'prodotto non trovato' });
      }

      response.json(prodotto);
    } catch (err) {
      console.error(err);
      response.status(500).json({ error: 'Errore durante il recupero del prodotto' });
    }
  };

  export const add = async (
    request: TypedRequest<AddProductDTO>,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { id_categoria, name, price, description, quantity, img } = request.body;

      const nuovoProdotto: ProductEntity = {
        id_categoria,
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


export const updateQuantity = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id, quantity } = request.body;

    if (!id || typeof quantity !== 'number') {
      response.status(400).json({ error: 'ID o quantità non validi' });
    }

    const updatedProduct = await updateProductQuantity(new Types.ObjectId(id), quantity);

    if (!updatedProduct) {
      response.status(404).json({ error: 'Prodotto non trovato' });
    }

    response.json(updatedProduct);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Errore durante l\'aggiornamento della quantità' });
  }
};

export const getByCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = request.params;

    if (!categoryId) {
      response.status(400).json({ error: 'ID categoria mancante o non valido' });
    }

    const products = await getProductsByCategory(categoryId);

    if (!products || products.length === 0) {
      response.status(404).json({ error: 'Nessun prodotto trovato per questa categoria' });
    }

     response.json(products);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Errore durante il recupero dei prodotti per categoria' });
  }
};

export const getFiltered = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await getFilteredProducts(req.query));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero prodotti filtrati" });
  }
};

