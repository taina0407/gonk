require.paths.unshift(__dirname + '/lib');

var fs = require('fs')
    , mongo = require('mongodb')
    , MongoLogger = require('logger').MongoLogger;

try {
  var configJSON = fs.readFileSync(__dirname + "/config/server.json");
} catch(e) {
  console.log("File config/server.json not found.  Try: `cp config/server.json.sample config/server.json`");
}

var config = JSON.parse(configJSON.toString());

db = new mongo.Db(config.mongo.db, new mongo.Server(config.mongo.ip_address, config.mongo.port, {}));

db.open(function(err, p_client){
    logger = new MongoLogger(db, config);
    logger.init();
});