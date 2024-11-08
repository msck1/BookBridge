import express from 'express';
import { createUser, readUser, readUserByEmail, updateUserByEmail, deleteUserByEmail, loginUser } from '../controller/controllerUser.js';
import { verifyToken } from '../middleware/token.js';

// rotas user
const routerUser = express();

routerUser.post('/createUser', createUser);

routerUser.get('/readUser', verifyToken, readUser,); 

routerUser.get('/readUserByEmail', verifyToken, readUserByEmail);

routerUser.put('/updateUserByEmail', verifyToken, updateUserByEmail);

routerUser.delete('/deleteUserByEmail', verifyToken , deleteUserByEmail);

routerUser.post('/loginUser', loginUser);

export { routerUser };