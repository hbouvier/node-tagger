(function () {
    var util    = require('util'),
        fs      = require('fs'),
        os      = require('os'),
        winston = require('winston'),
        opts    = require('node-options'),
        engine  = require('node-engine'),
        pos     = require('./postagger'),
        options = JSON.parse(fs.readFileSync('package.json')).configuration,
        logger  = null,
        meta    = { 
            "module" : "tagger",
            "pid"    : process.pid
        };
        
    function usage(errors) {
        logger.log('error', 'USAGE: %s --level=silly|verbose|info|warn|error --context=ws --port=3000 {phrase to tag}', meta.module, meta);
        if (errors) {
            logger.log('error', '       UNKNOWN ARGUMENTS: "%s"', errors.join('", "'), meta);
        }
    }
    
    function initLogger() {
        var log = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : options.level || "info",
                "json"     : false,
                "colorize" : true
            })
        ]});
        return log;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // MAIN
    //
    // To run on PAAS like Heroku or Cloud9, the server has to use the port from
    // the environment. Here we overwrite the configuration/command line option
    // with the Enviroment Variable "PORT", only if it is defined and the number
    // of workers will default to the number of CPU only if it is not specified
    // in the config nor on the command line.
    options.port    = process.env.PORT    || options.port;
    options.workers = process.env.WORKERS || options.workers  || os.cpus().length;
    
    // The "options" parameter is an object read from the package.json file.
    // Every property of that object can be overwritten through the command
    // line argument (e.g. --"property"=newValue)
    var result = opts.parse(process.argv.slice(2), options);
    logger = initLogger();
    
    // If an argument was passed on the command line, but was not defined in
    // the "configuration" property of the package.json, lets print the USAGE.
    if (result.errors) {
        usage(result.errors);
        process.exit(-1);
    }
    
    // The user specified a phrase at the end of the command line, lets just run 
    // the lexer and tagger on that phrase and exit.
    if (result.args && result.args.length > 0) {
        var phrase = result.args.join(' ');
        var words  = pos.api.lex(phrase);
        var tagged = pos.api.tag(words);
        var response = {"words":words,"tagged":tagged};
        var output = '';
        for (var i in response.tagged) {
            var taggedWord = response.tagged[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];
            if (output !== '') {
                output += ' ';
            }
            output += word + " /" + tag;
        }
        console.log(output);
    } else {
        // If not, start as a Web Server. The server will provide both an HTML
        // frontend and a JSON Web Service.
        var server = engine({
            "workers"      : options.workers,
            "script"       : __dirname + '/util/server',
            "scriptConfig" : {
                "port"    : options.port,
                "context" : options.context
            },
            "logger"       : logger,
        });
        if (server) {
            logger.log('debug', '%s|starting %d worker%s', options.name, options.workers, (options.workers > 1 ? 's' : ''));
            server.start().then(function () {
                logger.log('verbose', '%s|started|workers=%d', options.name, options.workers);
            }).fail(function (reason) {
                logger.log('error', '%s|FAILED|reason-%j', options.name, reason, meta);
                process.exit(-1);
            });
        }
    }
}).call();

