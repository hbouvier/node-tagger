module.exports = function () {
    var util    = require('util'),
        routes  = require('./routes'),
        express = require('express'),
        app     = express(),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = 'server';

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        routes.setLevel(level);
    }
    ////////////////////////////////////////////////////////////////////////////
    //
    // Start as a Web Service using the Express framework
    //
    function start(options) {
        
        ////////////////////////////////////////////////////////////////////////
        //
        // Express configuration for ALL environment
        //
        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.errorHandler());
        });
        
        routes.init(app, '/' + options.context);
        
        app.listen(options.port);
        if (level >= Level.info) util.log(name + '|Listening|port=' + options.port);        
    }
        
    return {
        "setLevel" : setLevel,
        "start"    : start
    };
}();




