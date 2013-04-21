(function () {
    var express = require('express'),
        util    = require('util'),
        fs      = require('fs'),
        pos     = require('./postagger'),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;

    ////////////////////////////////////////////////////////////////////////////
    //
    // Process the command line arguments.
    //
    function processArguments(args) {
        var error = null;
        var options = {
            "port"   : process.env.PORT || config.port,
            "debug"  : config.debug,
            "phrase" : null
        };

        var regex_ = /^--(\s*[^=\s]+)(?:\s*=(.*))?$/;
        var skip = 2;
        args.forEach(function (val, index, array) {
            if (skip-- > 0) return; // skip the executable (e.g. node) and the script (e.g. tagger.js)
            var capture = val.match(regex_);
            // Make sure we capture an 'option' and that it is part of the 'options' object (valid)
            if (capture !== null && capture.length === 3 && capture[1] !== undefined && options.hasOwnProperty(capture[1])) {
                if (capture[2] !== undefined) { // we have an ='something'
                    options[capture[1]] = capture[2];
                } else { // Assume it is a boolean toggle
                    options[capture[1]] = !options[capture[1]];
                }
            } else {
                error = error ? error + ", '" + val + "'" : "Unrecognized argument(s): '" + val + "'";
            }
        });
        if (error) {
            util.log(config.name + '|' + error);
        }
        return error ? null : options;
    }
    
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
    var options = processArguments(process.argv);
    if (options === null) {
        util.log(config.name + '|USAGE|[--port #] [--debug={true|false}] [--phrase="text to tag"]');
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

