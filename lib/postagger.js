module.exports = function () {
    var api  = require('./api'),
        rest = require('./rest');
        
    return {
        "api"  : api,
        "rest" : rest
    };
}();




