import { Router } from 'express';
import dotenv from 'dotenv';


dotenv.config();
const Routes = new Router();

Routes.get('/', (req, res) => res.send('Rewards-API - Endpoint padrão!'));

// Routes.get(`/categorias`, CategoriaController.index);
// Routes.post(`/categorias`, CategoriaController.store);

// Routes.get(`/categorias/:id_categoria/noticias`, ListarNoticiasController.index);

// Routes.post(`/categorias/:id_categoria/noticias`, NoticiaController.store);
// Routes.get(`/categorias/:id_categoria/noticias/:id_noticia`, NoticiaController.index);

export default Routes;