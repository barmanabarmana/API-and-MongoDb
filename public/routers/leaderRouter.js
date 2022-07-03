const express = require('express');
const bodyParser = require('body-parser');
const leaders = require('../models/leaders.js');
const dishes = require("../models/dishes");
const promotions = require("../models/promotions");
const leaderRouter = express.Router();
const authenticate = require('./authenticate');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
        leaders.find({})
            .then((dish)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        leaders.create(req.body)
            .then((dish)=> {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        leaders.remove({})
            .then((res) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(res);
            },(err) => next(err))
            .catch((err) => next(err));
    });

leaderRouter.route('/:leaderId')
    .get((req,res,next) => {
        leaders.findById(req.params.leaderId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'+ req.params.leaderId);
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        promotions.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        promotions.findByIdAndRemove(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = leaderRouter;

