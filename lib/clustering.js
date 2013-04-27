module.exports = function () {
    var util    = require('util'),
        cluster = require('cluster'),
        numCPUs = require('os').cpus().length,
        master  = require('./util/master'),
        worker  = require('./util/worker'),
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
            master.setLevel(level);
            master.start(script, options);
        } else {
            worker.setLevel(level);
            worker.start(script);
        }
    }
    
    function reload() {
        master.reload();
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"  : setLevel,
        "start"     : start,
        "reload"    : reload
    };
}();
