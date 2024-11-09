import { connection } from "../config.js";
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 10});

async function createClub (req, res) {
    const { nomebookclub , descricao } = req.body

    if (!nomebookclub || !descricao) {
        return res.status(500).json({
            error: "Dados incompletos",
            message: "Nome do clube, descrição é obrigatório"
        });
    }


    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);

        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar clubes"
            })
        }

        const checkDuplicate = `SELECT idbookclub FROM book_club WHERE nomebookclub = ? OR descricao = ? LIMIT 1`;
        const [existingClubs] = await connection.query(checkDuplicate, [nomebookclub, descricao]);

        if (existingClubs.length > 0) {
            return res.status(500).json({
                error: "Conflito",
                message: "Já existe um clube com este nome ou descricao"
            });
        }
        
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

        const cacheKey = `allClubs`;
        const cached = myCache.get(cacheKey);

        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);

        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para criar listar clubes"
            })
        }

        const select = `SELECT * FROM book_club`;
        const clubs = await connection.query(select);

        myCache.set(cacheKey, clubs);

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados", clubs});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function readClubByName(req, res) {
    const { nomebookclub } = req.body;

    if (!nomebookclub) {
        return res.status(500).json({
            message: "Nome do clube é obrigatório"
        });
    }

    try {

        const cacheKey = `clubBy${nomebookclub}`;
        const cached = myCache.get(cacheKey);

        if (cached) {
            console.log("Pego do cache");
            return res.status(200).send({message: "Dados pegos do cache", cached});
        }

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);

        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para listar clubes"
            })
        }

        const selectByName = `SELECT * FROM book_club WHERE nomebookclub = ?`;
        const clubs = await connection.query(selectByName, nomebookclub);

        
        myCache.set(cacheKey, clubs)

        connection.release();
        res.status(201).send({ message: "Dados pegos do banco de dados", clubs});
        
    } catch (err) {

        connection.release();
        res.status(500).send(err);
        
    }
    
}

async function updateClubByName(req, res) {
    const { nomebookclub, descricao, nomeantigo } = req.body;

    
    if (!nomebookclub || !descricao || !nomeantigo) {
        return res.status(500).json({
            message: "Nome atual, descrição e nome antigo do clube são obrigatórios"
        });
    }

    
    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);

        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para atualizar clubes"
            })
        }
        
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

    
    if (!nomebookclub) {
        return res.status(500).json({
            message: "Nome do clube é obrigatórios"
        });
    }


    try {

        const idUser = req.user.idusers;
        const checkUser = `SELECT * FROM users WHERE idusers = ?`
        const [userExists] = await connection.query(checkUser, idUser);

        if (userExists[0].idusers !== req.user.idusers) {
            return res.status(403).send({
                message: "Você não tem permissão para deletar clubes"
            })
        }
        
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