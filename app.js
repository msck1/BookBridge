import express from 'express';
import { routerUser } from './routes/routesUser.js';
import { routerBooks } from './routes/routesBooks.js';
import { routerBookClub } from './routes/routesBookClub.js';
import { routerList } from './routes/routesList.js';


const app = express();

app.use(express.json());
app.use('', routerUser, routerBooks, routerBookClub, routerList);

app.listen(3000, () => {
    console.log("Rodando na porta 3000")
});

