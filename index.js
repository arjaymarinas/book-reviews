import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";

const app = express();
const port = 3000;

dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

let reviews = [];

app.get('/', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM getBooks()");
        books = result.rows;
        res.send(books);
        console.log(books);
    } catch (error) {
        console.log(error);
    }
});

app.get('/books/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const result = await db.query('SELECT * FROM get_review_by_isbn($1)', [isbn]);
        reviews = result.rows;

        console.log(reviews);

        res.send(reviews);
    } catch (error) {
        res.send(500).json({error : "Internatl server error."});
    }
});

process.on('SIGINT', async () => {
    try {
        await db.end();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);
    }
});

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});

