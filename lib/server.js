module.exports = function () {
    var express = require('express'),
        util    = require('util'),
        fs      = require('fs'),
        pos     = require('./postagger'),
        app     = express(),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;


    function addOneRoute(route, method, destination) {
        if (method === 'GET') {
            app.get(route, destination);
        } else if (method === 'POST') {
            app.post(route, destination);
        } else if (method === 'PUT') {
            app.put(route, destination);
        } else if (method === 'DELETE') {
            app.delete(route, destination);
        } else {
            throw new Error(config.name + '|addOneRoute|EXCEPTION|unknown method:"' + method + '"|expecter=GET,POST,PUT,DELETE');
        }
        if (app.enabled('debug')) util.log(config.name + '|add|' + method + '|route='+route);
    }
    
    function addRoute(route, method, destination) {
        var methods;
        if (typeof(method) === 'string') {
            methods = method.split(',');
        } else if(typeof(method) === 'object') {  // array
            methods = method;
        } else {
            throw new Error(config.name + '|addRoute|EXCEPTION|unknown method:"' + typeof(method) + '"|expecter=string,object(array)');
        }
        for (var i = 0 ; i < methods.length ; ++i) {
            addOneRoute(route, methods[i], destination);
        }
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
            options.debug ? app.enable('debug') : app.disable('debug');
        });
        
        addRoute('/'+config.context + '/lex/:phrase?', 'GET,POST,PUT', pos.rest.lex);
        addRoute('/'+config.context + '/tag/:phrase?', 'GET,POST,PUT', pos.rest.tag);
        app.listen(options.port);
        if (app.enabled('debug')) util.log(config.name + '|Listening|port=' + options.port);        
    }
        
    return {
        "start" : start
    };
}();




