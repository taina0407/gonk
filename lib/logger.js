require.paths.unshift(__dirname);

var sys = require('sys')
    , AMI = require('asterisk').AMI

MongoLogger = function(db, config){
    var self = this; // needed to access this.db/this.config correctly in .onEvent()
    
    this.db = db;
    this.config = config;
    this.ami = null;
    
    this.init = function(){
        this.ami = new AMI(this.config);
        this.ami.addListener('event', this.onEvent);
        this.ami.connect();
    }
    
    this.onEvent = function(event){
        self.db.collection(self.config.mongo.collection, function(err, coll){
            coll.insert(event, function(err, doc){
                if (err){
                    sys.puts("EVENT Insert Error: " + sys.inspect(doc));
                }
            })
        });
    }    
}

exports.MongoLogger = MongoLogger;