Gonk
====

[http://muppet.wikia.com/wiki/Gonk](http://muppet.wikia.com/wiki/Gonk)

This is a playful project that might be useful to someone.  I wanted to do some node.js stuff and love playing
around with Asterisk.

Gonk is a server that connects to the Asterisk AMI and logs (to MongoDB) all "events".  The project should
provide someone with some pretty detailed information on what is going on at any point in time with an 
Asterisk machine.

Currently, we only log "events" but I would love to break this out into all the different "signal types" the AMI
sends to be a more complete logger.