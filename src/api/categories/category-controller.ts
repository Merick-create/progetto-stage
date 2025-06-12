import { Response, Request, NextFunction } from 'express';
import { creaCategoria, getCategorie, getCategoriaById } from './category-service';
import { CategoryEntity } from './category-entity';
import { TypedRequest } from '../../lib/typed-request.interface';
import { Types } from 'mongoose';

export const getListCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const listaCategorie = await getCategorie();
    response.json(listaCategorie);
  } catch (err) {
    console.error(err);
    response.status(404).json({ error: 'Categorie non trovate' });
  }
};

export const getCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.params['id'];
    const categoria = await getCategoriaById(new Types.ObjectId(id));

    if (!categoria) {
      response.status(404).json({ error: 'Categoria non trovata' });
      return;
    }

    response.json(categoria);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Errore durante il recupero della categoria' });
  }
};

export const addCategory = async (
  request: TypedRequest<{ name: string, img:string }>,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name,img } = request.body;

    const nuovaCategoria: CategoryEntity = {
      id: new Types.ObjectId(),
      name,
      img
    };

    const categoriaCreata = await creaCategoria(nuovaCategoria);

    response.status(201).json(categoriaCreata);
  } catch (err) {
    console.error(err);
    response.status(400).json({ error: 'Errore durante la creazione della categoria' });
  }
};