/*** Created by aquariuslt on 6/2/17.*/

import _ from 'lodash';

// hfc = hyperledger fabric client
import hfc from 'fabric-client';
import FabricCAService from 'fabric-ca-client/lib/FabricCAClientImpl';

import pathUtil from '../../lib/path-util';
import config from '../../config/config';
import log4js from 'log4js';
let logger = log4js.getLogger('HFCWrapper');

hfc.addConfigFile(pathUtil.root(config.file.network));
const networkConfig = hfc.getConfigSetting('network-config', {});

let hfcWrapper = hfc;

let clients = {};
let chains = {};

init();


function init() {
  initClients();
}

function initClients() {
  logger.info('Init Clients');
  const channelName = config.channelName;
  _.each(config.organizations, (organization) => {
    let client = new hfc();
    let chain = client.newChain(channelName);
    clients[organization] = client;
    chains[organization] = chain;
  });
}


function getClient(organization) {
  if (!_.isUndefined(clients[organization])) {
    return clients[organization];
  }
  return null;
}

function getCAClient(organization) {
  let caUrl = networkConfig[organization].ca;
  return new FabricCAService(caUrl);
}

function getNetworkConfig(){
  return networkConfig;
}


// currently to use a tmp path for storing key.
function getKeyValueStore(organization) {
  return _.join([config.keyValueStore, organization], '_');
}

function getMspId(organization){
  return networkConfig[organization].mspid;
}

hfcWrapper.getCAClient = getCAClient;
hfcWrapper.getClient = getClient;
hfcWrapper.getKeyValueStore = getKeyValueStore;
hfcWrapper.getNetworkConfig = getNetworkConfig;
hfcWrapper.getMspId = getMspId;

export default hfcWrapper;
