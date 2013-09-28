var nitrogen = require('nitrogen');

var config = {
//    host: 'api.nitrogen.io',
//    protocol: 'https'
};

config.store = new nitrogen.Store(config);

module.exports = config;
