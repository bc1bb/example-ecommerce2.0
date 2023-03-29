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
    connection.query("SELECT * FROM products", (err, rows) => {
        res.render('pages/manager/index', { products: rows });
    })
})

// Acknowledging GET calls on /manager/.../...
app.get('/manager/:action/:id', (req, res) => {
    // If action asked is delete, delete given id, using ? escapes string from unsafe characters
    if(req.params.action === "delete") {
        connection.query("DELETE FROM products WHERE id = ?", [req.params.id]);

        // Redirect user back
        res.redirect("/manager");
    }

    // If action asked is update, show update page
    if(req.params.action === "update") {
        connection.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, rows) => {
            res.render('pages/manager/update', { product: rows[0] });
        })
    }
})

// Acknowledging POST calls on /manager/.../...
app.post('/manager/:action/:id', (req, res) => {
    // If action asked is update, update
    if(req.params.action === "update") {
        let stock = 0;

        if(req.body.stock === "on") {
            stock = 1;
        }

        // Update product with informations given
        connection.query("UPDATE products SET name = ?, price = ?, in_stock = ?, image = ? WHERE id = ?", [req.body.product_name, parseInt(req.body.price), stock,  req.body.image, req.params.id]);

        // Redirect user back
        res.redirect("/manager");
    }
})

// Running app
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})