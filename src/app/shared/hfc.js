/** * Created by aquariuslt on 6/2/17.*/

var _ = require('lodash');
// hfc = hyperledger fabric client
var hfc = require('fabric-client');
var FabricCAService = require('fabric-ca-client/lib/FabricCAClientImpl');

var pathUtil = require('../../lib/path-util');
var config = require('../../config/config');
var log4js = require('log4js');
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

function getNetworkConfig() {
  return networkConfig;
}


// currently to use a tmp path for storing key.
function getKeyValueStore(organization) {
  return _.join([config.keyValueStore, organization], '_');
}

function getMspId(organization) {
  return networkConfig[organization].mspid;
}

hfcWrapper.getCAClient = getCAClient;
hfcWrapper.getClient = getClient;
hfcWrapper.getKeyValueStore = getKeyValueStore;
hfcWrapper.getNetworkConfig = getNetworkConfig;
hfcWrapper.getMspId = getMspId;

module.exports = hfcWrapper;
