var inherits = require('sys').inherits
    , net = require('net')
    , sys = require('sys')
    , EventEmitter = require('events').EventEmitter;

var CRLF = "\r\n";
var END_OF_RESP = "\r\n\r\n";

function AMI(config) {
    EventEmitter.call(this);
    
    var self = this; // needed to send .emit() signal correctly in .onData()
    
    this.config = config;
    this.conn = null;
    
    this.connect = function(){
        this.conn = net.createConnection(config.asterisk.port, config.asterisk.ip_address);
        this.conn.addListener('connect', this.onConnect);
        this.conn.addListener('data', this.onData);

        this.logIn();
    }

    this.logIn = function(){
        var msg = ""
        msg += "Action: Login" + CRLF
        msg += "Username: " + this.config.asterisk.username + CRLF
        msg += "Secret: " + this.config.asterisk.secret + CRLF + CRLF
        this.conn.write(msg)
    }

    this.onConnect = function(data){
        sys.puts("Gonk - Asterisk MongoDB event logger.")
    }

    // Copied and modified from https://github.com/mscdex/node-asterisk
    // https://github.com/mscdex/node-asterisk/blob/master/asterisk.js#L74
    // Copyright (C) 2010 Brian White <mscdex@gmail.com>
    this.onData = function(data){
        var buffer = "";

        data = data.toString();

    	if (data.substr(0, 21) == "Asterisk Call Manager")
    		data = data.substr(data.indexOf(CRLF) + 2); // we don't care about this

    	buffer += data;

    	var end, content, headers, kv, response_type;
    	while ((end = buffer.indexOf(END_OF_RESP)) > -1) {
    		content = buffer.substring(0, end + 2).split(CRLF);
    		buffer = buffer.substring(end + 4);
    		response = {};
    		response_type = "";
    		kv = [];
    		for (var i=0, len=content.length; i < len; i++) {
    			if (content[i].indexOf(": ") == -1)
    				continue; // move along
    			kv = content[i].split(": ", 2);
    			kv[0] = kv[0].toLowerCase().replace("-", "_");
    			if (i == 0)
    				response_type = kv[0];
    			response[kv[0]] = kv[1];
    		}

    		response["datetime"] = new Date()

    		switch (response_type) {
    			case "event":
    			    self.emit('event', response)
    			break;
    		}
    	}
    }
}

exports.AMI = AMI;
inherits(exports.AMI, EventEmitter);