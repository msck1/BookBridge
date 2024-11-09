import express from 'express';
import { createReview, deleteReviewByName, readReview, readReviewByBook, readReviewByName, updateReviewByName } from '../controller/controllerBookReview.js';
import { verifyToken } from '../middleware/token.js';

// rotas para review de livros

const routerReview = express();

routerReview.post('/createReview', verifyToken, createReview);

routerReview.get('/readReview', verifyToken, readReview);

routerReview.get('/readReviewByName', verifyToken, readReviewByName);

routerReview.get('/readReviewByBook', verifyToken, readReviewByBook);

routerReview.put('/updateReviewByName', verifyToken, updateReviewByName);

routerReview.delete('/deleteReviewByName', verifyToken, deleteReviewByName)

export { routerReview };