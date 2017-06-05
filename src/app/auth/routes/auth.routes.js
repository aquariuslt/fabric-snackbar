/*** Created by aquariuslt on 6/2/17.*/

var jwt = require('jsonwebtoken');

var config = require('../../../config/config');
var userService = require('../services/user.service');
var _ = require('lodash');
var log4js = require('log4js');
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

module.exports = authRoutes;



