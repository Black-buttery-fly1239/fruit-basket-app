const express = require('express');
const exphbs = require('express-handlebars');
const FruitBasket = require("./fruit-basket-service");

const pg = require("pg");
const Pool = pg.Pool;

const app = express();

let useSSL = false;
// eslint-disable-next-line no-undef
const local = process.env.LOCAL || false;
// eslint-disable-next-line no-undef
if (process.env.DATABASE_URL && !local) {
	// eslint-disable-next-line no-unused-vars
	useSSL = true;
}

const connectionString = process.env.DATABASE_URL || "postgresql://codex:codex123@localhost:5432/my_fruit_baskets_app";

const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

// console.log(exphbs);
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const fruitBasket = FruitBasket(pool);

let counter = 0;

app.get('/', async function (req, res) {


	res.render('index', {
		counter
	});
});

app.get('/basket/add', function (req, res) {
	res.render('basket/add');
});

app.get('/basket/edit', function (req, res) {
	res.render('basket/edit');
});

app.post('/basket/add', function(req,res){
	console.log(req.body.basket_name)
	res.redirect('/')
})

// app.post('/count', function(req, res) {
// 	counter++;
// 	res.redirect('/')
// });


// start  the server and start listening for HTTP request on the PORT number specified...
const PORT = process.env.PORT || 3017;
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});