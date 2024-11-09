import express from 'express';
import { createClub, readClub, readClubByName, updateClubByName, deleteClubByName } from '../controller/controllerBookClub.js';
import { verifyToken } from '../middleware/token.js';

// rotas club

const routerBookClub = express();

routerBookClub.post('/createClub', verifyToken, createClub);

routerBookClub.get('/readClub', verifyToken, readClub);

routerBookClub.get('/readClubByName', verifyToken, readClubByName);

routerBookClub.put('/updateClubByName', verifyToken, updateClubByName);

routerBookClub.delete('/deleteClubByName', verifyToken, deleteClubByName);

export { routerBookClub };