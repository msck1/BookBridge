import express from 'express';
import { routerUser } from './routes/routesUser.js';
import { routerBooks } from './routes/routesBooks.js';
import { routerBookClub } from './routes/routesBookClub.js';
import { routerList } from './routes/routesList.js'
import { routerReview } from './routes/routesBookReview.js';
import { routerUserClub } from './routes/routesUserBookClub.js';
import { routerStats } from './routes/routesStats.js';

import { swaggerConfig } from './docs/swaggerconfig.js';

const app = express();

app.use(express.json());
app.use('', routerUser, routerBooks, routerBookClub, routerList, routerReview, routerUserClub, routerStats, );

app.use('/api-docs', swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.swaggerDocument));

app.listen(3000, () => {
    console.log('API Rodando na porta 3000, '+'documentação da api em http://localhost:3000/api-docs')
});
