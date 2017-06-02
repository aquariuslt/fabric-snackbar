/*** Created by aquariuslt on 6/2/17.*/
import log4js from 'log4js';

import config from '../config/config';
import express from './express';

let logger = log4js.getLogger('App');

function init(next) {
  let app = express.initExpress();
  if (next) {
    next(app);
  }
}


function start(next) {
  init((app) => {
    app.listen(config.port, (error) => {
      if (error) {
        logger.error(error);
      }
      if (next) {
        next(app);
      }

      logger.info('Fabric Snackbar serving at port:', config.port);
    })
  });
}

export default {
  start
}
