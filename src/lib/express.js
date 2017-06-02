/** Created by CUIJA on 06-01-2017.*/

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import expressJWT from 'express-jwt';

import _ from 'lodash';

import pathUtil from './path-util';


import logger from './logger';


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

    // es6 way dynamic require using 'require('${es6-syntax-export-class}').default'
    require(routeAbsolutePath).default((app));
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


export default {
  initExpress
}
