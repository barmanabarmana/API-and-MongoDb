const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dishRouter = require('./routers/dishRouter');
const promoRouter = require('./routers/promoRouter');
const leaderRouter = require('./routers/leaderRouter');
const userRouter = require('./routers/userRouter');
const uploadRouter = require('./routers/uploadRouter');
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
// Secure traffic only
app.all('*', (req, res, next) => {
   if (req.secure) {
      return next();
   }
   else {
      res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
   }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.get('/',(req,res,next)=> {
   res.json("Home")
})
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
   console.log(`Connected to server`)
},(err) => {
   console.log(err);
});
app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use("/imageUpload",uploadRouter)


module.exports = app;
