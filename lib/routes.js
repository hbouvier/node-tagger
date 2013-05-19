module.exports = function () {
    var router  = require('./util/router'),
        pos     = require('./postagger'),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "reoutes",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);

    /**
     * initialize the routes that the Express Application will serve
     * 
     * @param app: an Express Application object
     * @param context: All the URL will start with that context prefix (e.g.
     *                 "/api/..." or "/webservice/...")
     */
    function init(app, context) {
        logger.log('debug', '%s|adding|routes|context=%s', meta.module, context, meta);
        router.add(app, context + '/lex/phrase', 'POST', pos.rest.lexPhrase);
        router.add(app, context + '/tag/words',  'POST', pos.rest.tagWords);
        router.add(app, context + '/tag/phrase', 'POST', pos.rest.tagPhrase);
    }

    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "init"     : init,
    };
}();




