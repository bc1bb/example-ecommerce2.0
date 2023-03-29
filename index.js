import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ecommerce',
    port: 3306,
    database: 'ecommerce',
    password: 'ecommerce'
})

app.get('/', (req, res) => {
    connection.query("SELECT * FROM products", (err, rows, fields) => {
        res.render('pages/index', { products: rows })
    })
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/cart', (req, res) => {
    res.render('pages/cart');
})

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})