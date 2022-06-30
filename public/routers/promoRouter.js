const express = require('express');
const bodyParser = require('body-parser');
const promotions = require('../models/promotions.js')
const authenticate = require('./authenticate');

const promoRoute = express.Router();


promoRoute.use(bodyParser.json());

promoRoute.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req,res,next) => {
    promotions.find({})
        .then((dish)=> {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);
        }, (err) => next(err))
        .catch((err) => next(err));
})
    .post(authenticate.verifyUser,(req, res, next) => {
        promotions.create(req.body)
            .then((dish)=> {
                console.log('Dish created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        promotions.remove({})
            .then((res) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(res);
            },(err) => next(err))
            .catch((err) => next(err));
    });

promoRoute.route('/:promoId')
    .get((req,res,next) => {
        promotions.findById(req.params.promoId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/'+ req.params.promoId);
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        promotions.findByIdAndRemove(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = promoRoute;

