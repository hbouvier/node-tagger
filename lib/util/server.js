module.exports = function () {
    var express = require('express'),
        cluster = require('cluster'),
        routes  = require('../routes'),
        app     = express(),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "tagger",
            "pid"    : process.pid,
            "id"     : cluster.id
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);
    
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
        var monitor = (options.statsd && options.syslogd) ? require('node-network-monitor')({
            "statsd" : {
                "host"   : options.statsd.host,
                "port"   : options.statsd.port,
                "domain" : options.statsd.domain
            },
            "syslogd" : {
                "host" : options.syslogd.host,
                "port" : options.syslogd.port
            }
        }) : null;
        
        ////////////////////////////////////////////////////////////////////////
        //
        // Express configuration for ALL environment
        //
        app.configure(function () {
            app.use(express.bodyParser());  // to parse the JSON body
            app.use(app.router);
            app.use(express.static(__dirname + '/../../app/')); // HTML UI
            app.use(express.errorHandler());
        });
        
        routes.init(app, '/' + options.context); // Add the postagger URIs to Express
        
        if (monitor)
            monitor.app(app.listen(options.port));
        else
            app.listen(options.port);

        logger.log('verbose', '%s|Listening|port=%d', meta.module, options.port, meta);
    }
    logger.log('debug', '%s|loaded|module=%s', meta.module, meta.module, meta);
    return {
        "start"    : start
    };
}();
