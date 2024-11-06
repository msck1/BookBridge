import { connection } from "../config.js";

async function createClub (req, res) {
    const { nomebookclub , descricao } = req.body

    try {
        
        const insert = `INSERT INTO book_club (nomebookclub, descricao) VALUES (?, ?)`;
        const [result] = await connection.query(insert, [nomebookclub, descricao]);
        const newBook = {
            id: result.insertId,
            nomebookclub,
            descricao,
        }

        connection.release();
        res.status(201).send(newBook);

    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function readClub (req, res) {
    
    try {

        const select = `SELECT * FROM book_club`;
        const clubs = await connection.query(select);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function readClubByName(req, res) {
    const { nomebookclub } = req.body;

    try {

        const selectByName = `SELECT * FROM book_club WHERE nomebookclub = ?`;
        const clubs = await connection.query(selectByName, nomebookclub);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateClubByName(req, res) {
    const { nomebookclub, descricao, nomeantigo } = req.body;
    
    try {
        
        const updateByName = `UPDATE book_club SET nomebookclub = ?, descricao = ? WHERE nomebookclub = ?`;
        const clubs = await connection.query(updateByName, [nomebookclub, descricao, nomeantigo]);
        connection.release();
        res.status(201).send(clubs);

    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}

async function deleteClubByName(req, res) {
    const { nomebookclub } = req.body;

    try {
        
        const deleteByName = `DELETE FROM book_club WHERE nomebookclub = ?`;
        const clubs = await connection.query(deleteByName, nomebookclub);
        connection.release();
        res.status(201).send(clubs)

    } catch (err) {
        
        connection.release();
        res.status(500).send(err);

    }
    
}

export { createClub, readClub, readClubByName, updateClubByName, deleteClubByName };