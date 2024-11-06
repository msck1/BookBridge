import express from 'express';
import { addBookToClub } from '../controller/controllerList.js';


// rotas para gerenciar livros que estao sendo lido por um clube

const routerList = express();

routerList.post('/addBookToClub', addBookToClub);



export { routerList };