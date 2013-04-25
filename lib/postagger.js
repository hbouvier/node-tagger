module.exports = function () {
    var util    = require('util'),
        api     = require('./util/api'),
        rest    = require('./util/rest'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "postagger";
        
    if (level >= Level.finest) util.log(name + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        api.setLevel(level);
        rest.setLevel(level);
    }

    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel" : setLevel,
        "api"      : api,
        "rest"     : rest
    };
}();




