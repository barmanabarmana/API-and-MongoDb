let express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
let passport = require('passport');
let authenticate = require('./middleware/authenticate');
const cors = require('./middleware/cors');


let router = express.Router();
router.use(bodyParser.json());

router.get('/', cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
    User.find({})
        .then((users)=> {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions ,(req, res, next) => {
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) => {
            if(err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            }
            else {
                if(req.body.firstname || req.body.lastname) {
                    user.firstname = req.body.firstname;
                    user.lastname = req.body.lastname;
                }
                user.save((err,user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        });
});


router.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req, res) => {
    let token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token, status: 'You are successfully logged in!',isAdmin: req.user.admin});
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        let err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

router.get('/facebook/token',passport.authenticate('facebook-token'),(req, res) => {
   if(req.user) {
       let token = authenticate.getToken({_id: req.user._id});
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json({success: true,token, status: 'You are successfully logged in!',isAdmin: req.user.admin});
   }
});
module.exports = router;
