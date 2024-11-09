import { connection } from "../config.js";

async function readAvgBookReview(req, res) {
    const { titulo } = req.body

    if (!titulo) {
        return res.status(500).json({
            message: "Titulo é obrigatório"
        });
    }

    try {

        const bookReview = `SELECT titulo, COUNT(*) OVER() as Total_de_Reviews,  AVG(nota) OVER() as Media_Geral FROM book_review INNER JOIN books ON books.idbooks = book_review.book_review_id WHERE book_review_id = (SELECT idbooks WHERE titulo = ?) ORDER BY nota DESC LIMIT 1`;
        const query = await connection.query(bookReview, [titulo]);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);
        
    }
    
}

async function readBookStatusInClub(req, res) {
    const { nomebookclub } = req.body;
    
    if (!nomebookclub) {
        return res.status(500).json({
            message: "Nome do club é obrigatório"
        });
    }

    
    try {
        // busca o staus do livro de acordo com concluido, lendo ou dropado filtrando e ordenando pelo nome do clube 
        const bookStatus = `SELECT nomebookclub, COUNT(CASE WHEN book_club_book.book_status = 'Concluido' THEN 1 END) as Livros_Concluidos, COUNT(CASE WHEN book_club_book.book_status = 'Lendo' THEN 1 END) as Livros_Lendo, COUNT(CASE WHEN book_club_book.book_status = 'Terminado' THEN 1 END) as Livros_Dropados FROM book_club_book INNER JOIN book_club ON book_club.idbookclub = book_club_book.book_club_id WHERE book_club.nomebookclub = ? GROUP BY book_club.idbookclub, book_club.nomebookclub ORDER BY book_club.nomebookclub`;
        const query = await connection.query(bookStatus, [nomebookclub]);
        connection.release();
        res.status(201).send(query);
        
    } catch (err) {

        connection.release();
        res.status(501).send(err);

    }
    
}



export { readAvgBookReview, readBookStatusInClub }