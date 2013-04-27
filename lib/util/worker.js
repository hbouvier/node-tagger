module.exports = function () {
    var util    = require('util'),
        cluster = require('cluster'),
        numCPUs = require('os').cpus().length,
        elapse = require('./elapse'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "worker";

    if (level >= Level.finest) util.log(name + '|' + process.pid + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
    
    function start(script) {
        if (level >= Level.fine) util.log(name + '|' + process.pid + '|slave|starting|script='+script);
        var application = require(script);
        setupObservers(application, script);
    }
    
    function setupObservers(application, script) {
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
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"  : setLevel,
        "start"     : start
    };
}();
