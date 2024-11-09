import express from 'express';
import { readAvgBookReview, readBookStatusInClub } from '../controller/controllerStats.js';
import { verifyToken } from '../middleware/token.js';

// rotas de stats

const routerStats = express();

routerStats.post('/readBookReviewAvg', verifyToken, readAvgBookReview);

routerStats.post('/readBookStatus', verifyToken, readBookStatusInClub);

export { routerStats };