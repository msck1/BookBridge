import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
});

const connection = await pool.getConnection();

const database = "bookbridge";

async function createDb (connection, database) {

    try {
        
        const query = `CREATE DATABASE IF NOT EXISTS ${database}`;
        await connection.query(query);
        await connection.release();
        console.log("Banco criado com sucesso");
        
    } catch (err) {

        console.log("Erro ao criar banco de dados", err);
        connection.release();
        
    }

}

async function createTables (connection, database) {

    try {

        const db = `USE ${database}`;

        const tableUser = `CREATE TABLE IF NOT EXISTS users 
        (idusers INT AUTO_INCREMENT PRIMARY KEY, 
        nomeuser VARCHAR(40), 
        email VARCHAR(30) UNIQUE, 
        senha VARCHAR(8))`;

        const tableBooks = `CREATE TABLE IF NOT EXISTS books
        (idbooks INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(40),
        sinopse VARCHAR(120),
        autores VARCHAR(40))`;

        const tableBookClub = `CREATE TABLE IF NOT EXISTS book_club
        (idbookclub INT AUTO_INCREMENT PRIMARY KEY,
        nomebookclub VARCHAR(40) UNIQUE,
        descricao VARCHAR(255))`;

        const tableUserBookClub = `CREATE TABLE IF NOT EXISTS user_book_club
        (iduserbookclub INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_club_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(idusers) ON DELETE CASCADE,
        FOREIGN KEY (book_club_id) REFERENCES book_club(idbookclub) ON DELETE CASCADE)`;

        const tableBookClubBooks = `CREATE TABLE IF NOT EXISTS book_club_book
        (idbookclubbooks INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        book_club_id INT NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books(idbooks) ON DELETE CASCADE,
        FOREIGN KEY (book_club_id) REFERENCES book_club(idbookclub) ON DELETE CASCADE)`;

        const tableBookReviews = `CREATE TABLE IF NOT EXISTS book_review 
        (idbookreviews INT AUTO_INCREMENT PRIMARY KEY,
        book_review_id INT NOT NULL,
        user_review_id INT NOT NULL,
        nota FLOAT,
        comentario VARCHAR(255),
        FOREIGN KEY (book_review_id) REFERENCES books(idbooks) ON DELETE CASCADE,
        FOREIGN KEY (user_review_id) REFERENCES users(idusers) ON DELETE CASCADE)`;

        await connection.query(db)
        await connection.query(tableUser);
        await connection.query(tableBooks);
        await connection.query(tableBookClub);
        await connection.query(tableUserBookClub);
        await connection.query(tableBookClubBooks);
        await connection.query(tableBookReviews);
        connection.release();
        console.log("Tabelas criada com sucesso");
        
    } catch (err) {

        console.log("Erro ao criar tabelas", err);
        connection.release();
        
    }

}

createDb(connection, database);
createTables(connection, database);

export { connection, createDb, createTables };