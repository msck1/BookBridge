import jwt from 'jsonwebtoken';
import { connection } from '../config.js';


async function verifyToken(req, res, next) { // enviar o token no header no formato Bearer <token aqui>
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: "Token não encontrado" });
    }
  
    try {

    // esse bloco decodifica o token e checa se o id que é passado nele existe no banco para depois atribuir esse valor a req, permite que um token seja valido apenas para um user

        const decoded = jwt.verify(token.split(' ')[1], 'segredo'); 

        if (!decoded.idusers || !decoded.nomeuser) {
            return res.status(403).send({ message: "Token inválido" });
        }

        const id = decoded.idusers;
        const query = `SELECT * FROM users WHERE idusers = ?`
        const [user] = await connection.query(query, [id]);

        if (user[0].idusers !== decoded.idusers) {
            return res.status(403).send({ message: "Usuário não encontrado" });
        } 

        req.user = user[0];
        next();

    } catch (err) {

        return res.status(403).send({ message: "Token invalido" });

    }
  }

export { verifyToken };