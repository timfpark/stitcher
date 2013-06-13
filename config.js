var nitrogen = require('nitrogen');

var config = {
        host: 'api.nitrogen.io',
        http_port: 443,
        protocol: 'https'
};

config.local_store_path = ".";
config.store = new nitrogen.FileStore(config);

config.base_url = config.protocol + "://" + config.host + ":" + config.http_port + "/api/v1";
config.realtime_url = config.base_url + "/realtime";

module.exports = config;
