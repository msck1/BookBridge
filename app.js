import express from 'express';
import { routerUser } from './routes/routesUser.js';
import { routerBooks } from './routes/routesBooks.js';
import { routerBookClub } from './routes/routesBookClub.js';
import { routerList } from './routes/routesList.js'
import { routerReview } from './routes/routesBookReview.js';
import { routerUserClub } from './routes/routesUserBookClub.js';
import { routerStats } from './routes/routesStats.js';

const app = express();

app.use(express.json());
app.use('', routerUser, routerBooks, routerBookClub, routerList, routerReview, routerUserClub, routerStats);

app.listen(3000, () => {
    console.log("Rodando na porta 3000")
});

