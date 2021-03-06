import { Profile } from './../../interfaces/profile';
import User from '../../models/user';
import * as crypto from 'crypto';
import Token from '../../models/token';
import * as logger from '../../helpers/logger';

const sgMail = require('@sendgrid/mail');

export function register(req, res) {
  // logger.debug(req.body);
  logger.debug('Registering user: ' + req.body.email);
  const user = new User();
  // logger.debug(user);
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;

  const promise = User.findOne({'email' : user.email}).populate('role').exec();
  promise.then(
    (result_user) => {
    if (result_user) {
      const content = {
        success: false,
        message: 'User alread exists'
      };
      res.send(content);
      return;
    } else {
      // logger.debug('user is not exist!');
      user.setPassword(req.body.password);

      user.profile = new Profile();
      user.save(function(err) {
        // logger.debug('save user')
        // logger.debug(user);
        const token = user.generateJwt();
        const email_token = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex')});

        email_token.save(
          (emailerr) => {
            if (emailerr) { return res.status(500).send({ msg: emailerr.message }); }

            // logger.debug(email_token);

            sgMail.setApiKey(process.env.sendgridKey);

            const env = process.env.NODE_ENV || 'dev';
            const protocol = (env === 'dev' ? 'http' : 'https');
            const msg = {
              to: user.email,
              from: 'no-reply@expensetracker.com',
              subject: 'Thank you for signin up Expense Tracker',
              text: 'Hello,\n\n' +
                    'Please verify your account by clicking the link: \n' +
                    protocol + ':\/\/' + req.headers.host + '\/confirmation\/' +
                    email_token.token + '?uid=' + user._id + '.\n',
              html: 'Hello,\n\n' +
                    'Please verify your account by clicking the link: \n' +
                    protocol + ':\/\/' + req.headers.host + '\/confirmation\/' +
                    email_token.token + '?uid=' + user._id + '.\n'
            };
            sgMail.send(msg).then(
              () => {
                logger.debug('sent');
              }
            );

            res.status(200);
            res.json({
              'user': user,
              'success': true,
              'message': 'You created a new user',
              'token' : token
            });
          }
        );
      });
    }
  });
}
