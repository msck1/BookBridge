import express from 'express';
import { addBookToClub, readAllBooksClubs, readBookInClub, readClubWithBook, updateBookInClub, updateClubInList, deleteClubListByName, updateBookStatus} from '../controller/controllerList.js';


// rotas para gerenciar livros que estao sendo lido por um clube

const routerList = express();

routerList.post('/addBookToClub', addBookToClub);

routerList.get('/readAllBooksClubs', readAllBooksClubs);

routerList.get('/readBookInClub', readBookInClub);

routerList.get('/readClubWithBook', readClubWithBook);

routerList.put('/updateBookInClub', updateBookInClub);

routerList.put('/updateClubInList', updateClubInList);

routerList.put('/updateBookStatus', updateBookStatus);

routerList.delete('/deleteClubListByName', deleteClubListByName);

export { routerList };