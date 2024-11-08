import { connection } from "../config.js";

async function createReview(req, res) {
    const { titulo, user, nota, comentario } = req.body;
    
    if (!titulo || !user || !nota|| !comentario) {
        return res.status(500).json({
            message: "Titulo, user, nota e comentario são obrigatórios"
        });
    }

    try {

        const checkDuplicate = `SELECT idbookreviews FROM book_review INNER JOIN books ON book_review.book_review_id = books.idbooks INNER JOIN users ON book_review.user_review_id = users.idusers WHERE titulo = ? AND nomeuser = ?`;
        const [duplicateResult] = await connection.query(checkDuplicate, [titulo, user]);
        
        if (duplicateResult.length > 0) {
            connection.release();
            return res.status(500).json({
                message: "Você já fez uma review para este livro"
            });
        }
 
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

    if (!titulo) {
        return res.status(500).json({
            message: "Titulo é obrigatório"
        });
    }

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

    if (!nomeuser) {
        return res.status(500).json({
            message: "Nome de usuario é obrigatório"
        });
    }

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

// implementar update e delete


export { createReview, readReview, readReviewByBook, readReviewByName};