/* Created by aquariuslt on 6/2/17.*/

var config = require('../../../config/config');

var hfc = require('../../shared/hfc');
var FabricCAService = require('fabric-ca-client/lib/FabricCAClientImpl');
var User = require('fabric-client/lib/User');


var log4js = require('log4js');
var _ = require('lodash');
let logger = log4js.getLogger('UserService');

const tlsOptions = {
  trustedRoots: [],
  verify: false
};

// SHA2-256
const cryptoSettings = {
  keysize: 256,
  hash: 'SHA2'
};


function getRegisteredUsers({username, organization}) {
  let client = hfc.getClient(organization);
  let caService = new FabricCAService(hfc.getNetworkConfig()[organization].ca, tlsOptions, cryptoSettings);
  let enrollmentSecret = null;

  let member;

  return hfc.newDefaultKeyValueStore({
    path: hfc.getKeyValueStore(organization)
  })
    .then((store) => {
      client.setStateStore(store);
      client._userContext = null;
      return client.getUserContext(username, true)
        .then((user) => {
          if (user && user.isEnrolled()) {
            logger.info(`Successfully loaded member:${username} = require( persistence`);
            return user;
          }
          else {
            return getAdminUser(organization)
              .then((adminUser) => {
                member = adminUser;
                // exception happen here
                // console.log(caService);

                return caService.register({
                  enrollmentID: username,
                  affiliation: organization
                }, member);
              })
              .then((secret) => {
                enrollmentSecret = secret;
                logger.info(`User:${username} registered successfully`);
                return caService.enroll({
                  enrollmentID: username,
                  enrollmentSecret: secret
                });
              }, (err) => {
                logger.error(`User:${username} registered failed`);
                return _.toString(err);
              })
              .then((message) => {
                if (_.isString(message) && message.includes('Error:')) {
                  logger.error(`User:${username} enrollment failed`);
                  logger.error(`${message}`);
                  return message;
                }
                logger.info(`User:${username}  enrollment successfully`);
                client.setUserContext(member, false)
                  .then(() => {
                    member = new User(username, client);
                    member._enrollmentSecret = enrollmentSecret;
                    return member.setEnrollment(message.key, message.certificate, hfc.getMspId(organization));
                  });
              })
              .then(() => {
                return client.setUserContext(member, false);
              }, (err) => {
                logger.error(`${username} enroll failed`);
                return _.toString(err);
              });
          }
        });
    });
}

function getAdminUser(organization) {
  let adminUser = _.head(config.users);
  let username = adminUser.username;
  let password = adminUser.secret;

  let member;

  let client = hfc.getClient(organization);
  return hfc.newDefaultKeyValueStore({
    path: hfc.getKeyValueStore(organization)
  })
    .then((store) => {
      client.setStateStore(store);
      client._userContext = null;
      return client.getUserContext(username, true)
        .then((user) => {
          if (user && user.isEnrolled()) {
            logger.info(`Successfully loaded admin member:${username} = require( persistence`);
            return user;
          }
          else {
            return hfc.getCAClient(organization)
              .enroll({
                enrollmentID: username,
                enrollmentSecret: password
              })
              .then((enrollment) => {
                logger.info(`Successfully enrolled user:${username}`);
                member = new User(username, client);
                return member.setEnrollment(enrollment.key, enrollment.certificate, hfc.getMspId(organization));
              })
              .then(() => {
                return client.setUserContext(member, false);
              })
              .then(() => {
                return member;
              })
              .catch((err) => {
                logger.error('Failed to enroll and persist user. Error: ' + err.stack ?
                  err.stack : err);
                return null;
              });
          }
        });
    });
}


module.exports = {
  getRegisteredUsers,
  getAdminUser
};

