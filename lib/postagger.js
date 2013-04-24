module.exports = function () {
    var api  = require('./api'),
        rest = require('./rest'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = "postagger";

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        api.setLevel(level);
        rest.setLevel(level);
    }
        
    return {
        "setLevel" : setLevel,
        "api"      : api,
        "rest"     : rest
    };
}();




