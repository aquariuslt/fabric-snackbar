/*** Created by aquariuslt on 6/2/17.*/

import jwt from 'jsonwebtoken';

import config from '../../../config/config';
import userService from '../services/user.service';
import * as _ from "lodash";
import log4js from 'log4js';
let logger = log4js.getLogger('AuthRoutes');

/**
 * curl -s -X POST http://localhost:5000/users -H "cache-control: no-cache" -H "content-type: application/x-www-form-urlencoded" -d 'username=Jason&organization=factory'
 * */

function authRoutes(app) {
  app.route('/users')
    .post((req, res) => {
      const username = req.body['username'];
      const organization = req.body['organization'];

      logger.debug('End point : /users');
      logger.debug('User name : ' + username);
      logger.debug('Org name  : ' + organization);

      let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(config.auth.exp),
        username: username,
        organization: organization
      }, app.get('secret'));

      userService.getRegisteredUsers({username, organization})
        .then((response) => {
          if (response && !_.isString(response)) {
            response.token = token;
            res.json(response);
          }
          else {
            res.json({
              success: false,
              message: response
            })
          }
        });
    });
}

export default authRoutes;



