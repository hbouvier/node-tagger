module.exports = function () {
    var util    = require('util'),
        routes  = require('./routes'),
        express = require('express'),
        app     = express(),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = 'server';

    if (level >= Level.finest) util.log(name + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
        routes.setLevel(level);
    }
    
    
    /**
     * Start the Web Server to provide both the HTML frontend and the JSON Web
     * service.
     * 
     * @param options an object containing two properties :
     *          options.context: The context (prefix on the URL) for the web 
     *                           service (e.g. http://context/resource)
     *          options.port:    The port on which the server will listen to
     */
    function start(options) {
        
        ////////////////////////////////////////////////////////////////////////
        //
        // Express configuration for ALL environment
        //
        app.configure(function () {
            app.use(express.bodyParser());  // to parse the JSON body
            app.use(app.router);
            app.use(express.static(__dirname + '/../app/')); // HTML UI
            app.use(express.errorHandler());
        });
        
        routes.init(app, '/' + options.context); // Add the postagger URIs to Express
        
        app.listen(options.port);
        if (level >= Level.info) util.log(name + '|Listening|port=' + options.port);
    }

    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel" : setLevel,
        "start"    : start
    };
}();




