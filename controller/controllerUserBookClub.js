import { connection } from "../config.js";

async function addUserToClub(req, res) {
    const { nomeusuario, nomebookclub } = req.body;

    if (!nomeusuario ||!nomebookclub) {
        return res.status(500).json({
            message: "Nome de usuario e nome do clube é obrigatório"
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

        const insert = `INSERT INTO user_book_club (user_id, book_club_id) VALUES ((SELECT idusers FROM users WHERE nomeuser = ?), (SELECT idbookclub FROM book_club WHERE nomebookclub = ?));`
        const [result] = await connection.query(insert, [nomeusuario, nomebookclub]);
        const newUser = {
            id: result.insertId,
            nomeusuario,
            nomebookclub,
        }

        connection.release();
        res.status(201).send(newUser);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }
    
}
// busca todos usuarios do clube
async function readUsersInClub(req, res) {
    const { nomebookclub } = req.body;

    if (!nomebookclub) {
        return res.status(400).json({
            message: "Nome do clube é obrigatório"
        });
    }

    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para visualizar clubes"
            });
        }

        const selectByClub = `SELECT nomeuser, nomebookclub FROM book_club INNER JOIN user_book_club ON user_book_club.book_club_id = book_club.idbookclub INNER JOIN users ON users.idusers = user_book_club.user_id WHERE nomebookclub = ?`;
        const users = await connection.query(selectByClub, nomebookclub);
        connection.release();
        res.status(200).send(users);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
    }
}

// busca todos os clubes que estão com certo usuario
async function readClubWithUser(req, res) {
    const { nomeuser } = req.body;

    if (!nomeuser) {
        return res.status(500).json({
            message: "Nome de usuario é obrigatório"
        });
    }

    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para visualizar clubes"
            })
        }


        const selectByUsers = `SELECT nomebookclub FROM book_club INNER JOIN user_book_club ON user_book_club.book_club_id = book_club.idbookclub INNER JOIN users ON users.idusers = user_book_club.user_id WHERE nomeuser = ?`;
        const clubs = await connection.query(selectByUsers, nomeuser);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }

    
}

async function readAllUserBooksClubs(req, res) {

    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para ler clubes"
            })
        }

        const select = `SELECT nomebookclub, nomeuser FROM book_club INNER JOIN user_book_club ON user_book_club.book_club_id = book_club.idbookclub INNER JOIN users ON users.idusers = user_book_club.user_id`;
        const clubsbooks = await connection.query(select);
        connection.release();
        res.status(201).send(clubsbooks);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateUserInClub(req, res) {
    const { usernovo, nomebookclub } = req.body;
    
    if (!usernovo ||!nomebookclub) {
        return res.status(500).json({
            message: "Nome de usuario novo e nome do clube é obrigatório"
        });
    }

    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);
        
        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para atualiar clubes"
            })
        }

        const updateByName = `UPDATE user_book_club INNER JOIN book_club ON user_book_club.book_club_id = book_club.idbookclub INNER JOIN users ON users.idusers = user_book_club.user_id SET user_id = (SELECT idusers FROM users WHERE nomeuser = ?) WHERE nomebookclub = ?`;
        const clubs = await connection.query(updateByName, [usernovo, nomebookclub]);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateClubWithClub(req, res) {
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
                message: "Você não tem permissão para atualiar clubes"
            })
        }

        const updateByName = `UPDATE user_book_club INNER JOIN book_club ON user_book_club.book_club_id = book_club.idbookclub INNER JOIN users ON users.idusers = user_book_club.user_id SET book_club_id = (SELECT idbookclub FROM book_club WHERE nomebookclub = ?) WHERE nomebookclub = ?`;
        const clubs = await connection.query(updateByName, [nomebookclub, nomebookclubantigo]);
        connection.release();
        res.status(201).send(clubs);
        
    } catch (err) {

        connection.release();
        res.status(500).send(err)
        
    }
    
}


async function deleteClubUser(req, res) {
    const { nomebookclub, nomeuser } = req.body;

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

        const deleteByNome = `DELETE user_book_club FROM user_book_club INNER JOIN book_club ON book_club.idbookclub = user_book_club.book_club_id INNER JOIN users ON users.idusers = user_book_club.user_id WHERE nomeuser = ? AND nomebookclub = ?`;
        const clubs = await connection.query(deleteByNome, [nomeuser, nomebookclub]);
        connection.release();
        res.status(201).send(clubs);

    } catch (err) {

        connection.release();
        res.status(500).send(err);

    }
        
}


export { addUserToClub, readUsersInClub, readClubWithUser, readAllUserBooksClubs, updateUserInClub, updateClubWithClub, deleteClubUser};