(function () {
    var util    = require('util'),
        fs      = require('fs'),
        opts    = require('./util/options'),
        server  = require('./clustering'),
        pos     = require('./postagger'),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;

    ////////////////////////////////////////////////////////////////////////////
    //
    // MAIN
    //
    var options = config;
    
    // To run on PAAS like Heroku or Cloud9, the server has to use the port from
    // the environment. Here we overwrite the configuration/command line option
    // with the Enviroment Variable "PORT", only if it is defined.
    options.port = process.env.PORT || options.port;
    
    // The "options" parameter is an object read from the package.json file.
    // Every property of that object can be overwritten through the command
    // line argument (e.g. --"property"=newValue)
    var unknownArgs = opts.parse(process.argv.slice(2), options);
    
    // If the user invoked us without specifying a phrase (e.g. using --phrase)
    // Let's print the USAGE
    if (options.phrase && typeof(options.phrase) !== 'string') {
        util.log(config.name + '|USAGE|[--port #] [--debug] [--phrase="text to tag"]');
        process.exit(-1);
    }
    
    // If an argument was passed on the command line, but was not defined in
    // the "configuration" property of the package.json, lets print the USAGE.
    if (unknownArgs) {
        util.log(config.name + '|Unknown arguments|"' + unknownArgs.join('", "') + '"');
        util.log(config.name + '|USAGE|[--port #] [--level={none|error|warning|info|fine|finest}] [--context=ws] [--phrase="text to tag"]');
        process.exit(-1);
    }
    
    // If "--phrase=..." was specified on the command line, lets just run the 
    // lexer and tagger on that phrase and exit.
    if (typeof(options.phrase) === 'string') {
        var words  = pos.api.lex(options.phrase);
        var tagged = pos.api.tag(words);
        var response = {"words":words,"tagged":tagged};
        for (var i in response.tagged) {
            var taggedWord = response.tagged[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];
            console.log(word + " /" + tag);
        }
    } else {
        // If not, start as a Web Server. The server will provide both an HTML
        // frontend and a JSON Web Service.
        server.setLevel(options.level);
        server.start(__dirname + '/util/server', options);
    }
}).call();

