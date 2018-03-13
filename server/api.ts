import * as express from 'express';
import logger = require("./helpers/logger");
import * as bodyParser from 'body-parser';
import User from "./models/user";
import Config from "./config";

import { login as loginCtrl, fbLogin } from "./controllers/auth/login";
import { register as registerCtrl } from './controllers/auth/register';
import { auth } from "./controllers/auth/middleware/auth";
import { users as usersCtrl } from "./controllers/users/users.controller";
import { orders as ordersCtrl, order as orderCtrl } from "./controllers/orders/orders.controller";
import { sendVerificationEmail } from './controllers/auth/auth';
import Token from './models/token';
let router = express.Router();
// let auth = require("./controllers/auth/middleware/auth");

// let registerCtrl = require("./controllers/auth/register");
// let loginCtrl = require("./controllers/auth/login");
// let usersCtrl = require("./controllers/users/users.controller");
// let ordersCtrl = require("./controllers/orders/orders.controller");

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
});

router.post('/register', registerCtrl);
router.post('/login', loginCtrl);

router.post('/fbLogin', fbLogin);
router.get('/check-state', auth.verifyToken, (req, res) => {
  let content = {
    success: true,
    message: 'Successfully logged in'
  }
  res.send(content);
});

router.post('/sendVerificationEmail', auth.verifyToken_unverified, sendVerificationEmail);

router.post('/confirmation/:token', function (req, res) {
  console.log(req.params);

  Token.findOne({'token' : req.params.token}, (err, token, done) => {
    if( err )
      return done(err);
    
    let content;
    if( !token ) {
      // console.log("token does not exist");
      res.status(200);
      res.json({
        "success": false,
        "message": 'The link is wrong'
      });
    } else {
      console.log("token exists");
      console.log(typeof req.query.uid);
      let obj = JSON.stringify(token);

      if(req.query.uid === token._userId.toString()) {
        //console.log("Successfully validated");
        User.findOne({'_id' : token._userId.toString()}, (err, user, done) => {
          if(user.isVerified){
            res.status(200).json({
              "success": false,
              "message": 'Email is already verified'
            });
            token.remove();
          }
          user.isVerified = true;
          user.save(
            (err) => {
              if (err) { return res.status(500).send({ msg: err.message }); }

              res.status(200).json({
                "success": true,
                "message": 'Email verification succeed'
              });
              token.remove();
            }
          )
        });

        //token.remove();
        
      } else {
        console.log("Validation fail");
      }
    }
  });
})
router.use('/user', auth.verifyToken, usersCtrl.user);
router.use('/users', auth.verifyToken, usersCtrl.users);
router.use('/orders', auth.verifyToken, ordersCtrl);
router.use('/order', auth.verifyToken, orderCtrl);

export = router;