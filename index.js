const express = require('express');
const exphbs = require('express-handlebars');
const FruitBasket = require("./fruit-basket-service");
require('dotenv').config()

const pg = require("pg");
const Pool = pg.Pool;

const app = express();

// let useSSL = false;
// // eslint-disable-next-line no-undef
// const local = process.env.LOCAL || false;
// // eslint-disable-next-line no-undef
// if (process.env.DATABASE_URL && !local) {
// 	// eslint-disable-next-line no-unused-vars
// 	useSSL = true;
// }

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

	const baskets = await fruitBasket.listBaskets()
	res.render('index', {
		baskets
	});
	//console.log(listBaskets())
});

app.get('/basket/add', function (req, res) {
	res.render('basket/add');
});

app.get('/basket/edit/:id', async function (req, res) {
	const basketId = req.params.id;
	const basket = await fruitBasket.getBasket(basketId);
	const fruits = await fruitBasket.listFruits();
	const basketItems = await fruitBasket.getBasketItems(basketId)
	res.render('basket/edit', {
		basket,
		fruits,
		basketItems
	});
});

app.post('/basket/update/:id', async function (req, res) {
    console.log(req.body)

	const basketId = req.params.id;
	const qty = req.body.qty;
	const fruit_id = req.body.fruit_id;

	await fruitBasket.addFruitToBasket(basketId, fruit_id, qty)

	res.redirect(`/basket/edit/${basketId}`)
// })
	// const basket = await fruitBasket.getBasket(basketId);
	// const fruits = await fruitBasket.listFruits();
	// res.render('basket/edit', {
	// 	basket,
	// 	fruits
	// });
});

app.post('/basket/add', async function(req,res){

	// console.log(req.body)
	try{
		await fruitBasket.createBasket(req.body.fruit_name);
	}catch (err){
		console.log(err)
	}
		


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