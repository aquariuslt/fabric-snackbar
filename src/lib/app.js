/*** Created by aquariuslt on 6/2/17.*/


import config from '../config/config';
import logger from './logger';
import express from './express';

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
