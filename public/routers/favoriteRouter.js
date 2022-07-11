const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./middleware/authenticate');
const cors = require('./middleware/cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .all((req,res,next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
      Favorite.findOne({ user:req.user._id })
          .populate('user')
          .populate('dishes')
          .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
        })
          .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite) {
                    for (let i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            favorite.dishes.push(req.body[i]._id);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                } else {
                    Favorite.create({"user": req.user._id, "dishes": req.body})
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err)=> next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
        Favorite.findOneAndRemove({user: req.user._id})
            .then((user)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            },(err)=> next(err))
            .catch((err)=> next(err));
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

    .get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/'+ req.params.dishId);
    })

    .post(cors.corsWithOptions,authenticate.verifyUser, (req,res,next) => {
        Favorite.findOne({user: req.user._id})
            .then((favoriteDish) => {
                if (favoriteDish) {
                    if (favoriteDish.dishes.indexOf(req.params.dishId) === -1) {
                        favoriteDish.dishes.push(req.params.dishId)
                        favoriteDish.save()
                            .then((favorite) => {
                                console.log('Favorite Created ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err))
                    }
                }
                else {
                    Favorite.create({"user": req.user._id, "dishes": [req.params.dishId]})
                        .then((favoriteDish) => {
                            console.log('Favorite Created ', favoriteDish);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favoriteDish);
                        }, (err) => next(err))
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if (favorite) {
                    index = favorite.dishes.indexOf(req.params.dishId);
                    if (index >= 0) {
                        favorite.dishes.splice(index, 1);
                        favorite.save()
                            .then((favorite) => {
                                console.log('Favorite Deleted ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err));
                    }
                    else {
                        let err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    let err = new Error('Favorites not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;


