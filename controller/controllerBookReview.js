import { connection } from "../config.js";
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 10});


async function createReview(req, res) {
    const { titulo, user, nota, comentario } = req.body;
    
    if (!titulo || !user || !nota|| !comentario) {
        return res.status(500).json({
            message: "Titulo, user, nota e comentario são obrigatórios"
        });
    }

    if (nota > 5 ) {
        return res.status(500).json({
            message: "A nota maxima é 5"
        });
    }

    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar reviews"
            })
        }

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

        const cacheKey = `allReview`;
        const cached = myCache.get(cacheKey);

        if (req.user.idusers !== users[0].idusers) {
            return res.status(403).send({ message: 'Voce não tem permissão para ler usuarios' });
        }

        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const select = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks`;
        const query = await connection.query(select);

        myCache.set(cacheKey, query);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados", query});
        
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

        const cacheKey = `bookReviewBy${titulo}`;
        const cached = myCache.get(cacheKey);

        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const selectByBook = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks WHERE titulo = ?`;
        const query = await connection.query(selectByBook, titulo);

        myCache.set(cacheKey, query)

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco", query});
        
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

        
        const cacheKey = `reviewBy${nomeuser}`;
        const cached = myCache.get(cacheKey);

        
        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const selectByName = `SELECT titulo, nomeuser, nota, comentario FROM book_review INNER JOIN users ON book_review.user_review_id = users.idusers INNER JOIN books ON book_review.book_review_id = books.idbooks WHERE nomeuser = ?`;
        const query = await connection.query(selectByName, nomeuser);

        myCache.set(cacheKey, query);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco", query});
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}

async function updateReviewByName(req, res) {
    const { nomeuser, titulo, nota, comentario, nomeuserantigo, tituloantigo } = req.body;

    if (!nomeuser || !titulo || !nota || !comentario || !nomeuserantigo || !tituloantigo) {
        return res.status(500).json({
            message: "Nome de usuario, titulo, nota, comentario, nome de usuario antigo e titulo antigo é obrigatório"
        });
    }

    try {

        const updateByName = `UPDATE book_review INNER JOIN books ON book_review.book_review_id = books.idbooks INNER JOIN users ON users.idusers = book_review.user_review_id SET book_review_id = (SELECT idbooks FROM books WHERE titulo = ?), user_review_id = (SELECT idusers FROM users WHERE nomeuser = ?), nota = ?, comentario = ? WHERE titulo = ? AND nomeuser = ?`
        const query = await connection.query(updateByName, [titulo, nomeuser, nota, comentario, tituloantigo, nomeuserantigo]);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}

async function deleteReviewByName(req, res) {
    const { nomeuser, titulo } = req.body;

    if (!nomeuser || !titulo) {
        return res.status(500).json({
            message: "Nome de usuario, titulo, nota, comentario, nome de usuario antigo e titulo antigo é obrigatório"
        });
    }

    try {

        const deleteByName = `DELETE book_review FROM book_review INNER JOIN books ON book_review.book_review_id = books.idbooks INNER JOIN users ON users.idusers = book_review.user_review_id WHERE nomeuser = ? AND titulo = ?`;
        const query = connection.query(deleteByName, [nomeuser, titulo]);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}

export { createReview, readReview, readReviewByBook, readReviewByName, updateReviewByName, deleteReviewByName};