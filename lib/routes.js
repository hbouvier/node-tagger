module.exports = function () {
    var util    = require('util'),
        router  = require('./router'),
        pos     = require('./postagger'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = "routes";

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        router.setLevel(level);
    }
    
    function init(app, context) {
        router.add(app, context + '/lex/phrase', 'POST', pos.rest.lexPhrase);
        router.add(app, context + '/tag/words',  'POST', pos.rest.tagWords);
        router.add(app, context + '/tag/phrase', 'POST', pos.rest.tagPhrase);
    }

    return {
        "init"      : init,
        "setLevel" : setLevel,
        "Level"    : Level
    };
}();




