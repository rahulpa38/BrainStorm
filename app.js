var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var catalogController = require('./controller/catalogController.js');
var profileController = require('./controller/profileController.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "brainstorm",resave: false,saveUninitialized: false}));


app.use('/',catalogController);
app.use('/myItems',profileController);
app.use('/myItems/signIn',profileController);
app.use('/myItems/check',profileController);

app.listen(3000);
console.log('Listening on port 3000');