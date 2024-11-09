import jwt from 'jsonwebtoken'
import { connection } from '../config.js';
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 10});

async function createUser (req, res) {
    const { nomeuser , email, senha } = req.body;
  
    if (!nomeuser || !email || !senha) {
        return res.status(500).send({
            message: "Nome de usuário, email e senha são obrigatórios"
        });
    }


    try {

        const checkDuplicate = `SELECT nomeuser, email FROM users WHERE nomeuser = ? OR email = ? LIMIT 1`;
        const [existingUsers] = await connection.query(checkDuplicate, [nomeuser, email]);
        
        if (existingUsers.length > 0) {
            return res.status(500).json({
                message: "Este usuario já esta em uso"
            });
        }

        const insert = `INSERT INTO users (nomeuser, email, senha) VALUES (?, ?, ?)`;
        const [result] = await connection.query(insert, [nomeuser, email, senha]);
        const newUser = {
            id: result.insertId,
            nomeuser,
            senha,
        }

        connection.release();
        res.status(201).send(newUser);

    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }

} 

async function readUser (req, res) {

    try {

        const cacheKey = "userList";
        const cached = myCache.get(cacheKey);

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`;
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para ler usuários"
            });
        }

        if (cached) {
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const select = `SELECT * FROM users`;
        const [users] = await connection.query(select);

        myCache.set(cacheKey, users);

        connection.release();
        res.status(200).send({message: "Dados pegos do banco de dados", users});

        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

}

async function readUserByEmail (req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(500).json({
            message: "Email é obrigatório"
        });
    }

    try {

        const cacheKey = `userList${email}`;
        const cached = myCache.get(cacheKey);

        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const selectByEmail = `SELECT * FROM users WHERE email = ?`
        const [users] = await connection.query(selectByEmail, [email]);

        if (req.user.idusers !== users[0].idusers) {
            return res.status(403).send({ message: 'Voce não tem permissão para ler usuarios' });
        }

        myCache.set(cacheKey, users)

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados",users});
        
    } catch (err) {

        connection.release();
        res.status(500).send({err});
        
    }
    
}

async function updateUserByEmail (req, res) {
    const { nomeuser, senha, email, emailantigo } = req.body; // atualiza usando o email antigo por um novo

    if (!nomeuser || !senha || !email || !emailantigo) {
        return res.status(500).send({
            message: "Nome de usuário, senha, email e emailantigo são obrigatórios"
        });
    }


    try {

        const checkEmail = `SELECT * FROM users WHERE email = ?`;
        const [existingUser] = await connection.query(checkEmail, [emailantigo]);

        if (existingUser[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para atualizar este usuário"
            });
        }

        const updateByEmail = `UPDATE users SET nomeuser = ?, email = ?, senha = ? WHERE email = ?`;
        const users = await connection.query(updateByEmail, [nomeuser, email, senha, emailantigo]);
        connection.release();
        res.status(201).send(users);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
}

async function deleteUserByEmail (req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(500).send({
            message: "Email é obrigatório"
        });
    }

    try {

        const checkEmail = `SELECT * FROM users WHERE email= ?`;
        const [existingUser] = await connection.query(checkEmail, [email]);

        if (existingUser[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para deletar este usuário"
            })
        }

        const deleteByEmail = `DELETE FROM users WHERE email = ?`;
        const users = await connection.query(deleteByEmail, email);
        connection.release();
        res.status(201).send(users);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function loginUser(req, res) { // cria token de acordo com o usuario do body
    const { nomeuser, senha } = req.body;

    if (!nomeuser || !senha) {
        return res.status(500).send({
            message: "Nome de usuário e senha são obrigatórios"
        });
    }
    
    try {

        const checkExists = `SELECT idusers, nomeuser, senha, email FROM users WHERE nomeuser = ? AND senha = ? `;
        const [existingUsers] = await connection.query(checkExists, [nomeuser, senha]);
        
        if (existingUsers.length === 0) {
            return res.status(500).send({
                message: "Este usuario não existe"
            });
        } 

        const user = existingUsers[0];

        // atribui o valor da query a paylod que depois vai virar um token jwt
        const payload = { 
            idusers: user.idusers,
            nomeuser: user.nomeuser,
            email: user.email,
            senha: user.senha,
        }

        const token = jwt.sign(payload, 'segredo', {expiresIn: '7d'});

        connection.release();
        res.status(201).send({ payload, token});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

}

      
export { createUser, readUser, readUserByEmail, updateUserByEmail, deleteUserByEmail, loginUser };
