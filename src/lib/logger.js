/*** Created by aquariuslt on 6/2/17.*/

import winston from 'winston';
import moment from 'moment';

let logger = new winston.Logger({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return '[' + moment().format('YYYY-MM-DD hh:mm:ss') + ']';
      }
    })
  ]
});



export default logger;
