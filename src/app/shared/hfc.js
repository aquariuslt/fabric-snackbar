/*** Created by aquariuslt on 6/2/17.*/


// hfc = hyperledger fabric client
import hfc from 'fabric-client';


import pathUtil from '../../lib/path-util';
import config from '../../config/config';





hfc.addConfigFile(pathUtil.root(config.file.network));
