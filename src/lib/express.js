/** Created by CUIJA on 06-01-2017.*/

var express =require('express');
var bodyParser= require('body-parser');
var cookieParser= require('cookie-parser');
var compress= require('compression');
var cors= require('cors');
var expressJWT= require('express-jwt');

var _= require('lodash');

var pathUtil= require('./path-util');


var log4js= require('log4js');
let logger = log4js.getLogger('Express');


function initBasicMiddleware(app) {
  process.on('uncaughtException', function (error) {
    logger.error(error);
  });

  app.set('trust proxy', true);
  app.set('showStackError', true);
  //noinspection JSUnusedGlobalSymbols
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg|woff2|woff/).test(res.getHeader('Content-Type'));
    },
    level: 6
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());

}

function initSecurityMiddleware(app) {
  app.options('*', cors());
  app.use(cors());

  // using snackbar-secret as secret, suppose define another
  app.set('secret', 'snackbar-secret');
  app.use(expressJWT({
      secret: 'snackbar-secret'
    }).unless({
      path: [
        '/users'
      ]
    })
  );
}

function initServerRoutes(app) {
  let router = express.Router();

  let serverRoutes = pathUtil.calGlobPaths('src/app/*/routes/*.js');
  _.each(serverRoutes, (routePath) => {
    let routeAbsolutePath = pathUtil.root('/')+routePath;
    logger.info('Loading route:',routeAbsolutePath);

    require(routeAbsolutePath)(app);
  });

  app.use('/', router);
}


function initExpress() {
  let app = express();
  initBasicMiddleware(app);
  initSecurityMiddleware(app);
  initServerRoutes(app);
  return app;
}


module.exports = {
  initExpress
};
