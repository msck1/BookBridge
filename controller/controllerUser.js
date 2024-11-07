import jwt from 'jsonwebtoken';
import { connection } from '../config.js';

async function createUser (req, res) {
    const { nomeuser , email, senha } = req.body;
  
    if (!nomeuser || !email || !senha) {
        return res.status(500).json({
            message: "Nome de usuário, email e senha são obrigatórios"
        });
    }


    try {

        const checkDuplicate = `SELECT nomeuser, email FROM users WHERE nomeuser = ? OR email = ? LIMIT 1`;
        const [existingUsers] = await connection.query(checkDuplicate, [nomeuser, email]);
        
        if (existingUsers.length > 0) {
            return res.status(500).json({
                message: "Este nome de usuário já está em uso"
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

        const select = `SELECT * FROM users`;
        const users = await connection.query(select);
        connection.release();
        res.status(201).send(users);
        
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

        const selectByEmail = `SELECT * FROM users WHERE email = ?`
        const users = await connection.query(selectByEmail, email);
        connection.release();
        res.status(201).send(users);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateUserByEmail (req, res) {
    const { nomeuser, senha, email, emailantigo } = req.body; // atualiza usando o email antigo por um novo

    if (!nomeuser || !senha || !email || !emailantigo) {
        return res.status(500).json({
            message: "Nome de usuário, senha, email e emailantigo são obrigatórios"
        });
    }


    try {

        const updateByEmail = `UPDATE users SET nomeuser = ?, email = ?, senha = ? WHERE email = ?`
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
        return res.status(500).json({
            message: "Email é obrigatórios"
        });
    }


    try {

        const deleteByEmail = `DELETE FROM users WHERE email = ?`
        const users = await connection.query(deleteByEmail, email);
        connection.release();
        res.status(201).send(users);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

export { createUser, readUser, readUserByEmail, updateUserByEmail, deleteUserByEmail };
