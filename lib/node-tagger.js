(function () {
    var express = require('express'),
        util    = require('util'),
        fs      = require('fs'),
        tagger  = require('../lib/taggerService'),
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
        
        var baseURL = '/'+config.context + '/tag'; 
        if (app.enabled('debug')) util.log(config.name + '|adding route|/'+baseURL);
        app.get(baseURL + '/:phrase?', tagger.tagRequest); // ".../tag/hello world" and ".../tag?phase=hello world"
        app.put(baseURL, tagger.tagRequest);               // ".../tag" with body '{ phrase : "hello world" }'
        app.post(baseURL, tagger.tagRequest);              // ".../tag" with body '{ phrase : "hello world" }'    
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
    
    tagger.init(options, config);
    
    var taggedWords = typeof(options.phrase) === 'string' ? tagger.tag(options.phrase) : server(options);
    for (var i in taggedWords) {
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        console.log(word + " /" + tag);
    }

}).call();

