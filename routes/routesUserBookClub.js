import express from 'express';
import { addUserToClub, readClubWithUser, readUsersInClub, readAllUserBooksClubs, updateUserInClub, updateClubWithClub, deleteClubUser } from '../controller/controllerUserBookClub.js';
import { verifyToken } from '../middleware/token.js';
import { routerBookClub } from './routesBookClub.js';

// rotas para gerenciar usuarios em clubes

const routerUserClub = express();

routerUserClub.post('/addUserToClub', verifyToken, addUserToClub);

routerBookClub.get('/readAllUserBookClub', verifyToken, readAllUserBooksClubs)

routerUserClub.get('/readUsersInClub', verifyToken, readUsersInClub);

routerUserClub.get('/readClubWithUser', verifyToken, readClubWithUser);

routerUserClub.put('/updateUserInClub', verifyToken, updateUserInClub);

routerUserClub.put('/updateClubWithClub', verifyToken, updateClubWithClub);

routerUserClub.delete('/deleteUserClub', verifyToken, deleteClubUser)

export { routerUserClub };