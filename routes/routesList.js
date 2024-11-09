import express from 'express';
import { addBookToClub, readAllBooksClubs, readBookInClub, readClubWithBook, updateBookInClub, updateClubInList, deleteClubListByName} from '../controller/controllerList.js';
import { verifyToken } from '../middleware/token.js';



// rotas para gerenciar livros que estao sendo lido por um clube

const routerList = express();

routerList.post('/addBookToClub', verifyToken, addBookToClub);

routerList.get('/readAllBooksClubs', verifyToken, readAllBooksClubs);

routerList.get('/readBookInClub', verifyToken, readBookInClub);

routerList.get('/readClubWithBook', verifyToken, readClubWithBook);

routerList.put('/updateBookInClub', verifyToken, updateBookInClub);

routerList.put('/updateClubInList', verifyToken, updateClubInList);

routerList.put('/updateBookStatus', verifyToken,updateBookStatus);

routerList.delete('/deleteClubListByName',verifyToken, deleteClubListByName);

export { routerList };