import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

// Setting up Express.JS + eJS + body-parser
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;

// Connecting to Database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ecommerce',
    port: 3306,
    database: 'ecommerce',
    password: 'ecommerce'
})

// Acknowledging GET calls on /
app.get('/', (req, res) => {
    // Checking products from database to fill page
    connection.query("SELECT * FROM products", (err, rows, fields) => {
        res.render('pages/index', { products: rows })
    })
})

// Acknowledging GET calls on /login
app.get('/login', (req, res) => {
    res.render('pages/login');
})

// Acknowledging GET calls on /cart
app.get('/cart', (req, res) => {
    res.render('pages/cart');
})

// Acknowledging GET calls on /manager
app.get('/manager', (req, res) => {
    // Checking products from database to fill page
    connection.query("SELECT * FROM products", (err, rows, fields) => {
        res.render('pages/manager', { products: rows });
    })
})

// Acknowledging GET calls on /manager/.../...
app.get('/manager/:action/:id', (req, res) => {
    // If action asked is delete, delete given id, using ? escapes string from unsafe characters
    if(req.params.action === "delete") {
        connection.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    }

    // Redirect user to last page
    res.redirect("/manager");
})

// Running app
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})