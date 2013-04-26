module.exports = function () {
    var util    = require('util'),
        cluster = require('cluster'),
        numCPUs = require('os').cpus().length,        
        elapse = require('./util/elapse'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "clustering";

    if (level >= Level.finest) util.log(name + '|' + process.pid + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
    
    function start(script, options) {
        if (cluster.isMaster) {
            if (level >= Level.fine) util.log(name + '|' + process.pid + '|master|starting|cpu=' + numCPUs);
            for (var i = 0 ; i < numCPUs ; ++i) {
                var worker = cluster.fork();
                worker.send({
                    "id"       : i,
                    "origin"   : "master",
                    "command"  : "setLevel",
                    "newLevel" : level
                });
                worker.send({
                    "id"      : i,
                    "origin"  : "master",
                    "command" : "start",
                    "options" : options
                });
            }
        } else {
            if (level >= Level.fine) util.log(name + '|' + process.pid + '|slave|starting');
            var application = require(script);
            process.on('message', function (msg) {
                if (level >= Level.finest) util.log(name + '|' + process.pid + '|slave|application=' + script + '|message=' + util.inspect(msg));
                if (msg.command === 'setLevel') {
                    if (level >= Level.fine) util.log(name + '|' + process.pid + '|slave|application=' + script + '|setLevel=' + msg.newLevel);
                    application.setLevel(msg.newLevel, msg.id);
                } else if (msg.command === 'start') {
                    if (level >= Level.fine) util.log(name + '|' + process.pid + '|slave|application=' + script + '|starting');
                    application.start(msg.options, msg.id);
                } else  {
                    if (level >= Level.warning) util.log(name + '|' + process.pid + '|slave|application=' + script + '|unknown message=' + util.inspect(msg));
                }
            });
        }
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"  : setLevel,
        "start"     : start
    };
}();
