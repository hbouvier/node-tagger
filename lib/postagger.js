module.exports = function () {
    var api     = require('./util/api'),
        rest    = require('./util/rest'),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "postagger",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);
    
    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "api"      : api,
        "rest"     : rest
    };
}();




