import express from 'express';
import { readAvgBookReview, readBookStatusInClub } from '../controller/controllerStats.js';
import { verifyToken } from '../middleware/token.js';

// rotas de stats

const routerStats = express();

routerStats.get('/readBookReviewAvg', verifyToken, readAvgBookReview);

routerStats.get('/readBookStatus', verifyToken, readBookStatusInClub);

export { routerStats };