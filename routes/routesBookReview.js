import express from 'express';
import { createReview, readReview, readReviewByBook, readReviewByName, } from '../controller/controllerBookReview.js';

// rotas para review de livros

const routerReview = express();

routerReview.post('/createReview', createReview);

routerReview.get('/readReview', readReview);

routerReview.get('/readReviewByName', readReviewByName);

routerReview.get('/readReviewByBook', readReviewByBook);

export { routerReview };