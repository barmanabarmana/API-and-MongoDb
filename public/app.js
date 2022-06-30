const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dishRouter = require('./routers/dishRouter');
const promoRouter = require('./routers/promoRouter');
const leaderRouter = require('./routers/leaderRouter');
const userRouter = require('./routers/userRouter');
const dishes = require('./models/dishes');
const assert = require("assert");
const MongoClient = require('mongodb').MongoClient;
const createError = require("http-errors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
let passport = require('passport');
let authenticate = require('./routers/authenticate');
let config  = require('../config');

const app = express();

const port = process.env.PORT || 3000;
const url = config.mongoUrl;

const connect = mongoose.connect(url);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(session({ secret: 'SECRET' }));

app.use('/users', userRouter);

app.get('/',(req, res, next) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'text/plain');
   res.end('Home');

});

connect.then((db)=> {
   console.log(`Connected to the server localhost:${port}`)
},(err) => {
   console.log(err);
});
app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);



app.listen(port, function () {
   console.log('Your app is listening on port ' + port)
});
