import jwt from 'jsonwebtoken';
import { connection } from '../config.js';

async function createUser (req, res) {
    const { nomeuser , email, senha } = req.body;

    try {

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
