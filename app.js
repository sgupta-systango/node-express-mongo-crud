//Import some node modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const hbs = require('express-handlebars');
const upload = require('express-fileupload')
const flash = require('connect-flash')
const handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

//importing dbconnect module
const dbconnect = require('./config/dbconnect')

//importing user routes
const Users = require('./routes/user.routes')

//importing products routes
const Products = require('./routes/product.routes')

//importing index routes
const indexRoutes = require('./routes/index.routes')

//importing allProducts routes
const allProducts = require('./routes/allProduct.routes')

//importing cart routes
const Carts = require('./routes/cart.routes')

//importing order routes
const Orders = require('./routes/order.routes')

//defining port
const PORT = process.env.PORT || 5000;

//create app of express js
const app = express();

//configure view engine as hbs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs');

//set main layout to every pages
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'mainlayout',
    layoutDir: __dirname + '/views/layouts',
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));

//call the dbconnect to connect to mongoose localhost server
dbconnect();

//to use for uploading files
app.use(upload())

//to use for sending msg when redirecting
app.use(flash())

//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//secret Key encreption for session value
app.use(session({
    secret: "secret@#$%!1234bcdni",
    cookie: { maxAge: (30 * 86400 * 1000) },
    resave: false,
    saveUninitialized: false
}));

//to link stacic contents like js & css into views
app.use(express.static(path.join(__dirname, 'views')));

//Find the upload directory to access files
app.use(express.static('upload'))

//caching disabled for everyone
app.use(function(request, response, next) {
    response.set('Cache-Control', 'no-cache,private,no-store,must-revalidate,max-state=0,post-check=0,pre-check=0');
    next();
})

//configure routes
app.use('/', indexRoutes);
app.use('/user', Users);
app.use('/product', Products);
app.use('/allProduct', allProducts);
app.use('/cart', Carts);
app.use('/order', Orders);

app.get('*', (req, res) => {
    res.status(404).send('Page not found');
})

//server configuration
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
