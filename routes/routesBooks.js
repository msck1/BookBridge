import express from 'express';
import { createBook, deleteBookByAuthor, readBook, readBookByAuthor, updateBookByAuthor } from '../controller/controllerBooks.js';
import { verifyToken } from '../middleware/token.js';

//rotas book
const routerBooks = express();

routerBooks.post('/createBook', verifyToken, createBook);

routerBooks.get('/readBook', verifyToken, readBook);

routerBooks.get('/readBookByAuthor', verifyToken, readBookByAuthor);

routerBooks.put('/updateBookByAuthor', verifyToken, updateBookByAuthor);

routerBooks.delete('/deleteBookByAuthor', verifyToken, deleteBookByAuthor);

export { routerBooks };