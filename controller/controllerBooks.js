import { connection } from '../config.js';

async function createBook (req, res) {
    const { titulo, sinopse, autores } = req.body;

    try {

        const insert = `INSERT INTO books (titulo, sinopse, autores) VALUES (?, ?, ?)`;
        const [result] = await connection.query(insert, [titulo, sinopse, autores]);
        const newBook = {
            id: result.insertId,
            titulo,
            sinopse,
            autores,
        }

        connection.release();
        res.status(201).send(newBook);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)

    }
    
}

async function readBook (req, res) {
    
    try {

        const select = `SELECT * FROM books`;
        const books = await connection.query(select);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}


async function readBookByAuthor (req, res) {
    const { autores } = req.body;
    
    try {

        const selectByAuthor = `SELECT * FROM books WHERE autores = ?`;
        const books = await connection.query(selectByAuthor, autores);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateBookByAuthor (req, res) {
    const { titulo, sinopse, autores, autoresantigos } = req.body; // mesma logica de user, pedimos o autor antigo e atualizamos tudo
    
    try {

        const updateByAuthor = `UPDATE books SET titulo = ? , sinopse = ?, autores = ? WHERE autores = ?`;
        const books = await connection.query(updateByAuthor, [titulo, sinopse, autores, autoresantigos]);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
    
}

async function deleteBookByAuthor (req, res) {
    const { autores } = req.body;
    
    try {

        const deleteByAuthor = `DELETE FROM books WHERE autores = ?`;
        const books = await connection.query(deleteByAuthor, autores);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
    
}

export { createBook, readBook, readBookByAuthor, updateBookByAuthor, deleteBookByAuthor };