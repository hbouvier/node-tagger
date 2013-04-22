(function () {
    var express = require('express'),
        util    = require('util'),
        fs      = require('fs'),
        opts    = require('./options'),
        pos     = require('./postagger'),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;

    ////////////////////////////////////////////////////////////////////////////
    //
    // Start as a Web Service using the Express framework
    //
    function server(options) {
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
        app.get(baseTagURL + '/:phrase?', pos.rest.tag); // ".../tag/hello world" and ".../tag?phase=hello world"
        app.put(baseTagURL, pos.rest.tag);               // ".../tag" with body '{ phrase : "hello world" }'
        app.post(baseTagURL, pos.rest.tag);              // ".../tag" with body '{ phrase : "hello world" }'    
        
        app.listen(options.port);
        if (app.enabled('debug')) util.log(config.name + '|Listening|port=' + options.port);        
    }
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // MAIN
    //
    var options = {
            "port"   : process.env.PORT || config.port,
            "debug"  : config.debug,
            "phrase" : null
        }; 
    var unknownArgs = opts.parse(process.argv.slice(2), options);
    if (options.phrase && typeof(options.phrase) !== 'string') {
        util.log(config.name + '|USAGE|[--port #] [--debug] [--phrase="text to tag"]');
        process.exit(-1);
    }
    if (unknownArgs) {
        util.log(config.name + '|Unknown arguments|"' + unknownArgs.join('", "') + '"');
        util.log(config.name + '|USAGE|[--port #] [--debug] [--phrase="text to tag"]');
        process.exit(-1);
    }
    
    var response = typeof(options.phrase) === 'string' ? {"words":pos.api.lex(options.phrase), "tagged" : pos.api.tag(pos.api.lex(options.phrase)) } : server(options);
    
    util.log('taggedWords=' + util.inspect(response));
    for (var i in response.tagged) {
        var taggedWord = response.tagged[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        console.log(word + " /" + tag);
    }

}).call();

