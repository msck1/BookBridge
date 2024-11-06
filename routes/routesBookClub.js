import express from 'express';
import { createClub, readClub, readClubByName, updateClubByName, deleteClubByName } from '../controller/controllerBookClub.js';

// rotas club

const routerBookClub = express();

routerBookClub.post('/createClub', createClub);

routerBookClub.get('/readClub', readClub);

routerBookClub.get('/readClubByName', readClubByName);

routerBookClub.put('/updateClubByName', updateClubByName);

routerBookClub.delete('/deleteClubByName', deleteClubByName);

export { routerBookClub };