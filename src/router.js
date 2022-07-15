import { Router } from 'express';
import dotenv from 'dotenv';

import RewardsController from './app/controllers/RewardsController.js';

dotenv.config();
const Routes = new Router();

Routes.get('/', (req, res) => res.send('Rewards-API - Endpoint padrão!'));

Routes.get(`/points/:id_client`, RewardsController.index);
Routes.post(`/points`, RewardsController.store);


export default Routes;