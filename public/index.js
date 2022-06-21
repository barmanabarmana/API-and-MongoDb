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
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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
