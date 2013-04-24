(function () {
    var util    = require('util'),
        fs      = require('fs'),
        opts    = require('./options'),
        server  = require('./server'),
        pos     = require('./postagger'),
        config  = JSON.parse(fs.readFileSync('package.json')).configuration;

    ////////////////////////////////////////////////////////////////////////////
    //
    // MAIN
    //
    var options = config;
    options.port = process.env.PORT || options.port;
    
    var unknownArgs = opts.parse(process.argv.slice(2), options);
    if (options.phrase && typeof(options.phrase) !== 'string') {
        util.log(config.name + '|USAGE|[--port #] [--debug] [--phrase="text to tag"]');
        process.exit(-1);
    }
    if (unknownArgs) {
        util.log(config.name + '|Unknown arguments|"' + unknownArgs.join('", "') + '"');
        util.log(config.name + '|USAGE|[--port #] [--level={none|error|warning|info|fine|finest}] [--context=ws] [--phrase="text to tag"]');
        process.exit(-1);
    }
    
    if (typeof(options.phrase) === 'string') {
        var words  = pos.api.lex(options.phrase);
        var tagged = pos.api.tag(words);
        var response = {"words":words,"tagged":tagged};
        util.log('taggedWords=' + util.inspect(response));
        for (var i in response.tagged) {
            var taggedWord = response.tagged[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];
            console.log(word + " /" + tag);
        }
    } else {
        server.setLevel(options.level);
        server.start(options);
    }
}).call();

