import { connection } from "../config.js";
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 10});

async function addBookToClub(req, res) {
    const { titulo, nomebookclub, status } = req.body; // os status do livro devem ser Lendo, Concluido ou Terminado

    if (!titulo ||!nomebookclub || !status) {
        return res.status(500).json({
            message: "Titulo, nome do clube e status é obrigatório"
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

        const checkDuplicate = `SELECT book_id, book_club_id from book_club_book INNER JOIN books ON books.idbooks = book_club_book.book_id INNER JOIN book_club ON book_club.idbookclub = book_club_book.book_club_id WHERE book_id = (SELECT idbooks FROM books WHERE titulo = ?) AND book_club_id = (SELECT idbookclub FROM book_club WHERE nomebookclub = ?);`;
        const [existingBook] = await connection.query(checkDuplicate, [titulo, nomebookclub]);
        
        if (existingBook.length > 0) {
            return res.status(500).json({
                message: "Este livro já foi adicionado"
            });
        }

        const insert = `INSERT INTO book_club_book (book_id, book_club_id, book_status) VALUES ((SELECT idbooks FROM books WHERE titulo = ?), (SELECT idbookclub FROM book_club WHERE nomebookclub = ?), ?);`
        const [result] = await connection.query(insert, [titulo, nomebookclub, status]);
      
        const newList = {
            id: result.insertId,
            titulo,
            nomebookclub,
            status,
        }

        connection.release();
        res.status(201).send(newList);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }
    
}
// busca todos livros daquele clube
async function readBookInClub(req, res) {
    const { nomebookclub } = req.body;

    if (!nomebookclub) {
        return res.status(500).json({
            message: "Nome do clube é obrigatório"
        });
    }

    try {

        
        const cacheKey = `${nomebookclub}InClub`;
        const cached = myCache.get(cacheKey);

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar reviews"
            })
        }

        if (cached) {
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        // devido a tabela associativa a query precisa de um ou mais inner join para achar o id correto de acordo com o nosso where
        const selectByClub = `SELECT titulo, nomebookclub FROM book_club INNER JOIN book_club_book ON book_club.idbookclub = book_club_book.book_club_id INNER JOIN books ON book_club_book.book_id = books.idbooks WHERE nomebookclub = ?`;
        const books = await connection.query(selectByClub, nomebookclub);

        myCache.set(cacheKey, books);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados", books});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}

// busca todos os clubes que estão com certo livro
async function readClubWithBook(req, res) {
    const { titulo } = req.body;

    if (!titulo) {
        return res.status(500).json({
            message: "Titulo é obrigatório"
        });
    }

    try {

        const cacheKey = `${titulo}WithClub`;
        const cached = myCache.get(cacheKey);

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar reviews"
            })
        }

        if (cached) {
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        // mesma logica da query acima
        const selectByBook = `SELECT nomebookclub FROM book_club INNER JOIN book_club_book ON book_club.idbookclub = book_club_book.book_club_id INNER JOIN books ON book_club_book.book_id = books.idbooks WHERE titulo = ?`;
        const books = await connection.query(selectByBook, titulo);

        myCache.set(cacheKey, books);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados", books});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}

async function readAllBooksClubs(req, res) {

    try {


        const cacheKey = "allBooksClubs";
        const cached = myCache.get(cacheKey);

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar reviews"
            })
        }

        if (cached) {
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }


        const select = `SELECT nomebookclub, titulo FROM book_club INNER JOIN book_club_book ON book_club.idbookclub = book_club_book.book_club_id INNER JOIN books ON book_club_book.book_id = books.idbooks`;

        const clubsbooks = await connection.query(select);

        myCache.set(cacheKey, clubsbooks);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados" ,clubsbooks});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateBookInClub(req, res) {
    const { titulonovo, nomebookclub } = req.body;
    
    if (!titulonovo ||!nomebookclub) {
        return res.status(500).json({
            message: "Titulo novo e nome do clube é obrigatório"
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

        const updateByName = `UPDATE book_club_book INNER JOIN books ON book_club_book.book_id = books.idbooks INNER JOIN book_club ON book_club_book.book_club_id = book_club.idbookclub SET book_id = (SELECT idbooks FROM books WHERE titulo = ?) WHERE nomebookclub = ?`;
        const books = await connection.query(updateByName, [titulonovo, nomebookclub]);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateClubInList(req, res) {
    const { nomebookclub, nomebookclubantigo } = req.body;
    
    if (!nomebookclub || !nomebookclubantigo) {
        return res.status(500).json({
            message: "Nome do clube e nome do clube antigo é obrigatório"
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

        const updateByName = `UPDATE book_club_book INNER JOIN books ON book_club_book.book_id = books.idbooks INNER JOIN book_club ON book_club_book.book_club_id = book_club.idbookclub SET book_club_id = (SELECT idbookclub FROM book_club WHERE nomebookclub = ?) WHERE nomebookclub = ?`;
        const clubs = await connection.query(updateByName, [nomebookclub, nomebookclubantigo]);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }
    
}


async function updateBookStatus(req, res) {
    const { status, nomebookclub, titulo} = req.body;
    
    if (!status || !nomebookclub || !titulo) {
        return res.status(500).json({
            message: "Status do livro, nome do clube e titulo é obrigatorio"
        });
    }

    try {

        const updateByName = `UPDATE book_club_book INNER JOIN books ON book_club_book.book_id = books.idbooks INNER JOIN book_club ON book_club_book.book_club_id = book_club.idbookclub SET status = ? WHERE nomebookclub = ? AND titulo = ?`;
        const books = await connection.query(updateByName, [status, nomebookclub, titulo]);
        connection.release();
        res.status(201).send(books);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}


async function deleteClubListByName(req, res) {
    const { nomebookclub } = req.body;

    if (!nomebookclub) {
        return res.status(500).json({
            message: "Nome do clube é obrigatório"
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

        const deleteByNome = `DELETE book_club_book FROM book_club_book INNER JOIN books ON book_club_book.book_id = books.idbooks INNER JOIN book_club ON book_club_book.book_club_id = book_club.idbookclub WHERE nomebookclub = ?`;
        const clubs = await connection.query(deleteByNome, nomebookclub);
        connection.release();
        res.status(201).send(clubs);

    } catch (err) {

        connection.release();
        res.status(500).send(err);

    }
        
}


export { addBookToClub, readBookInClub, readClubWithBook, readAllBooksClubs, updateBookInClub, updateClubInList, deleteClubListByName, updateBookStatus };