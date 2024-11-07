import { connection } from "../config.js";

async function createReview(req, res) {
    const { titulo, user, nota, comentario } = req.body; 

    try {
 
        const insert = `INSERT INTO book_review (book_review_id, user_review_id, nota, comentario) VALUES ((SELECT idbooks FROM books WHERE titulo = ?), (SELECT idusers FROM users WHERE nomeuser = ?), ?, ?)`
        const [result] = await connection.query(insert, [titulo, user, nota, comentario]);
        const newReview = {
            id: result.insertId,
            titulo,
            user,
            nota,
            comentario,
        }

        connection.release();
        res.status(201).send(newReview);

        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

}

async function readReview(req, res) {

    try {

        const select = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks`;
        const query = await connection.query(select);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}


async function readReviewByBook(req, res) {
    const { titulo } = req.body;

    try {

        const select = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks WHERE titulo = ?`;
        const query = await connection.query(select, titulo);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}


async function readReviewByName(req, res) {
    const { nomeuser } = req.body;

    try {

        const select = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks WHERE nomeuser = ?`;
        const query = await connection.query(select, nomeuser);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}


export { createReview, readReview, readReviewByBook, readReviewByName};