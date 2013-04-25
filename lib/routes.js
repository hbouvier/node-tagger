module.exports = function () {
    var util    = require('util'),
        router  = require('./util/router'),
        pos     = require('./postagger'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "routes";

    if (level >= Level.finest) util.log(name + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        router.setLevel(level);
    }
    
    /**
     * initialize the routes that the Express Application will serve
     * 
     * @param app: an Express Application object
     * @param context: All the URL will start with that context prefix (e.g.
     *                 "/api/..." or "/webservice/...")
     */
    function init(app, context) {
        if (level >= Level.finest) util.log(name + '|adding|routes|context="' + context + '"');
        router.add(app, context + '/lex/phrase', 'POST', pos.rest.lexPhrase);
        router.add(app, context + '/tag/words',  'POST', pos.rest.tagWords);
        router.add(app, context + '/tag/phrase', 'POST', pos.rest.tagPhrase);
    }

    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "init"     : init,
        "setLevel" : setLevel,
        "Level"    : Level
    };
}();




