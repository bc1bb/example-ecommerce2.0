import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import session from "express-session";
import cookieParser from "cookie-parser";
import sleep from "sleep";

// Setting up Express.JS + eJS
const app = express();

app.set('view engine', 'ejs');

// Setting up public/
app.use(express.static('public'));
// Setting up  cookies and sessions of max age "(1000 * 60 * 60 * 24)" = 24 hours
app.use(session({ cookie: { maxAge: (1000 * 60 * 60 * 24) }, secret: 'EcOmMeRcE' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const port = 3000;


function createConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'ecommerce',
        port: 3306,
        database: 'ecommerce',
        password: 'ecommerce'
    });
}

// Acknowledging GET calls on /
app.get('/', async (req, res) => {
    // Connecting to Database
    const connection = createConnection();

    // If cart undefined, create it
    if(!(req.session.cart)) {
        req.session.cart = [];
    }

    // Checking products from database to fill page
    connection.execute("SELECT * FROM products", (err, rows) => {
        res.render('pages/index', {products: rows})
    })
})

// Acknowledging GET calls on /login
app.get('/login', (req, res) => {
    res.render('pages/login');
})


// Acknowledging GET calls on /cart
app.get('/cart', (req, res) => {
    if(!(req.session.cart)) {
        res.render("pages/cart", {cart: []});
        return;
    } else if (req.session.cart.length === 0) {
        res.render("pages/cart", {cart: []});
        return;
    }

    // Connecting to Database
    const connection = createConnection();

    // Creating empty cart, this array will host every item's id, name and price
    let cartComplete = [];
    // async / await
    req.session.cart.forEach((item) => {
        // Creating empty element
        let element = {
            id: item,
            name: "",
            price: 0,
        }

        // Checking on database
        connection.execute("SELECT * FROM products WHERE id = ?", [item], (err, rows) => {
            cartComplete.push(element);
        });

        while(cartComplete.length === 0) {
            sleep.msleep(100);
        }

        console.log(cartComplete);
    });
})

// Acknowledging GET calls on /cart/.../...
app.get('/cart/:action/:id', (req, res) => {
    // If cart undefined, create it
    if(!(req.session.cart)) {
        req.session.cart = [];
    }


    // If action asked is to add to cart, add item on session
    if(req.params.action === "add") {
        req.session.cart.push(req.params.id);
    }

    // If action asked is to delete from cart, remove item from session
    if(req.params.action === "delete") {
        // Create a new cart, find element user wants to remove
        // push new cart on session
        let newCart = [];

        req.session.cart.forEach((item) => {
            if(!(item === req.params.id)) {
                newCart.push(item);
            }
        })

        req.session.cart = newCart;
    }

    res.redirect('/');
})

// Acknowledging GET calls on /manager
app.get('/manager', async (req, res) => {
    // Connecting to Database
    const connection = createConnection();

    // Checking products from database to fill page
    connection.execute("SELECT * FROM products", (err, rows) => {
        res.render('pages/manager/index', {products: rows});
    })
})

// Acknowledging GET calls on /manager/.../...
app.get('/manager/:action/:id', async (req, res) => {
    // Connecting to Database
    const connection = createConnection();

    // If action asked is delete, delete given id, using ? escapes string from unsafe characters
    if (req.params.action === "delete") {
        connection.execute("DELETE FROM products WHERE id = ?", [req.params.id]);

        // Redirect user back
        res.redirect("/manager");
    }

    // If action asked is update, show update page
    if (req.params.action === "update") {
        connection.execute("SELECT * FROM products WHERE id = ?", [req.params.id], (err, rows) => {
            res.render('pages/manager/update', {product: rows[0]});
        });
    }

    // If action asked is create, create a new item
    if (req.params.action === "create") {
        connection.execute("INSERT INTO products (name, price, in_stock, image) VALUES ('New item', 0, 0, 'https://picsum.photos/215/324?grayscale&blur')");

        res.redirect('/manager');
    }
})

// Acknowledging POST calls on /manager/.../...
app.post('/manager/:action/:id', async (req, res) => {
    // Connecting to Database
    const connection = createConnection();

    // If action asked is update, update
    if (req.params.action === "update") {
        // Managing the weird way that browsers use to tell if a radiobox is checked or not
        let stock = 0;

        if (req.body.stock === "on") {
            stock = 1;
        }

        // Update product with informations given
        connection.execute("UPDATE products SET name = ?, price = ?, in_stock = ?, image = ? WHERE id = ?", [req.body.product_name, parseInt(req.body.price), stock, req.body.image, req.params.id]);

        // Redirect user back
        res.redirect("/manager");
    }
})

// Running app
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})