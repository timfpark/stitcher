var nitrogen = require('nitrogen')
  , Store = require('nitrogen-leveldb-store');

var config = {
//    host: 'api.nitrogen.io',
//    protocol: 'https'
};

config.store = new Store(config);

module.exports = config;
