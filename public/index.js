const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dishRouter = require('./routers/dishRouter');
const promoRouter = require('./routers/promoRouter');
const leaderRouter = require('./routers/leaderRouter');
const dishes = require('./models/dishes');
const assert = require("assert");
const MongoClient = require('mongodb').MongoClient;
const createError = require("http-errors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/conFusion';

const connect = mongoose.connect(url);
const url1 = 'mongodb://localhost:27017/';
const dbname = 'conFusion';
app.use(logger('dev'));
app.use(cookieParser('12345-67890-09876-54321'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function auth (req, res, next) {
   if(!req.signedCookies.user) {
      let authHeader = req.headers.authorization;
      if (!authHeader) {
         let err = new Error('You are not authenticated!');
         res.setHeader('WWW-Authenticate', 'Basic');
         err.status = 401;
         next(err);
         return;
      }

      let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      let user = auth[0];
      let pass = auth[1];
      if (user === 'admin' && pass === 'password') {
         res.cookie('user', 'admin', {signed: true});
         next(); // authorized
      } else {
         let err = new Error('Wrong login or password.Try again!');
         res.setHeader('WWW-Authenticate', 'Basic');
         err.status = 401;
         next(err);
      }
   }else {
      if(req.signedCookies.user === 'admin') {
         next();
      }else {
         let err = new Error('You are not authenticated!');
         err.status = 401;
         next(err);
      }
   }
}

app.use(auth);


MongoClient.connect(url1, (err, client) => {

   assert.equal(err,null);

   console.log('Connected correctly to server');

   const db = client.db(dbname);

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
