module.exports = function () {
    var express = require('express'),
        util    = require('util'),
        fs      = require('fs'),
        pos     = require('./postagger'),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;

    ////////////////////////////////////////////////////////////////////////////
    //
    // Start as a Web Service using the Express framework
    //
    function start(options) {
        var app = express();
        
        ////////////////////////////////////////////////////////////////////////
        //
        // Express configuration for ALL environment
        //
        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.errorHandler());
            options.debug ? app.enable('debug') : app.disable('debug');
        });
        
        var baseLexURL = '/'+config.context + '/lex'; 
        if (app.enabled('debug')) util.log(config.name + '|adding route|/'+baseLexURL);
        app.get(baseLexURL + '/:phrase?', pos.rest.lex); // ".../lex/hello world" and ".../tag?phase=hello world"
        app.put(baseLexURL, pos.rest.lex);               // ".../lex" with body '{ phrase : "hello world" }'
        app.post(baseLexURL, pos.rest.lex);              // ".../lex" with body '{ phrase : "hello world" }'    
        
        var baseTagURL = '/'+config.context + '/tag'; 
        if (app.enabled('debug')) util.log(config.name + '|adding route|/'+baseTagURL);
        app.get(baseTagURL + '/:phrase?', pos.rest.tag); // ".../tag/hello world" and ".../tag?phase=hello world"
        app.put(baseTagURL, pos.rest.tag);               // ".../tag" with body '{ phrase : "hello world" }'
        app.post(baseTagURL, pos.rest.tag);              // ".../tag" with body '{ phrase : "hello world" }'    
        
        app.listen(options.port);
        if (app.enabled('debug')) util.log(config.name + '|Listening|port=' + options.port);        
    }
        
    return {
        "start" : start
    };
}();




