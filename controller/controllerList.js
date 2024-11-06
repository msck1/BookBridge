import { connection } from "../config.js";

async function addBookToClub(req, res) {
    const { titulo, nomebookclub } = req.body;

    try {

        const insert = `INSERT INTO book_club_book (book_id, book_club_id) VALUES ((SELECT idbooks FROM books WHERE titulo = ?), (SELECT idbookclub FROM book_club WHERE nomebookclub = ?));`
        const [result] = await connection.query(insert, [titulo, nomebookclub]);
        const newList = {
            id: result.insertId,
            titulo,
            nomebookclub,
        }

        connection.release();
        res.status(201).send(newList);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }
    
}
// todos livro daquele clube
async function readBookInClub(req, res) {
    const { nomebookclub } = req.body; 

    try {

        const select = `SELECT * FROM book_club_book`;
        const books = await connection.query(select);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}

// seleciona todos os livros que estao em um clube
async function readClubWithBook(req, res) {

    try {

        const select = `SELECT * FROM book_club_book`;
        const books = await connection.query(select);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}


async function updateBookInClubByName(req, res) {
    const { titulo, nomebookclub } = req.body;

    try {

        const updateByName = `UPDATE `
        
    } catch (err) {
        
    }
    
}

export { addBookToClub, readBookInClub, updateBookInClubByName };