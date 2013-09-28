module.exports = function () {
    var express = require('express'),
        swagger = require('swagger-node-express'),
        cluster = require('cluster'),
        routes  = require('../routes'),
        app     = express(),
        os      = require('os'),
        url     = require('url'),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "debug",
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
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.bodyParser());  // to parse the JSON body
            app.use(express.methodOverride());
            app.use(app.router);
            app.use(express.static(__dirname + '/../../app/')); // HTML UI
            app.use(express.errorHandler());
        });

        // development only
        if ('development' == app.get('env')) {
            app.use(express.errorHandler());
        }

        var isSwaggerApp = (function configureSwagger() {
            var swaggerApp = express();
            // Set the main handler in swagger to the express app
            app.use('/' + options.context, swaggerApp);
            logger.log('debug', '%s|swagger|app.use|%s', meta.module, '/' + options.context, meta);
            swagger.setAppHandler(swaggerApp);
    
            // Serve up swagger ui at /docs via static route
            var docs_handler = express.static(__dirname + '/../../swagger-ui');
            app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
                if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
                    res.writeHead(302, { 'Location' : req.url + '/' });
                    res.end();
                    return;
                }
                // take off leading /docs so that connect locates file correctly
                req.url = req.url.substr('/docs'.length);
                return docs_handler(req, res, next);
            });
            //routes.init(swaggerApp, '/' + options.context, swagger);
            routes.init(swaggerApp, '/pos', swagger);
            
            var baseURL = process.env.BASEURL || os.hostname() + ':' + options.port;
            swagger.configure('http://' + baseURL + '/' + options.context , '0.0.1');
            
            // This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
            // methods, the header `api_key` OR query param `api_key` must be equal
            // to the string literal `special-key`.  All other HTTP ops are A-OK
            swagger.addValidator(
                function validate(req, path, httpMethod) {
                    //  example, only allow POST for api_key="special-key"
                    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
                        var apiKey = req.headers["x-api-key"];
                        if (!apiKey) {
                            apiKey = url.parse(req.url,true).query["api_key"]; }
                        if ("henri-id" == apiKey) {
                            return true;
                        }
                        logger.log('error', '%s|swagger|X-API-KEY=%s|INVALID', meta.module, apiKey, meta);
                        logger.log('info', '%s|swagger|headers=%s', meta.module, req.headers, meta);
                        return false;
                    }
                    return true;
                }
            );
            swagger.setHeaders = function setHeaders(res) {
                res.header('Access-Control-Allow-Origin', "*");
                res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
                res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
                res.header("Content-Type", "application/json; charset=utf-8");
            };
            return true;
        })();
        if (!isSwaggerApp)
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
