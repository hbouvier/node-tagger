module.exports = function () {
    var api    = require('./api'),
        elapse = require('./elapse'),
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "rest",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);
        
    /**
     * HTTP Request to lex a phrase
     * 
     * @param req: an HTTP request
     * @param res: an HTTP response
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://tagger.beeker.c9.io/ws/lex/phrase
     */
    function lexPhrase(req, res) {
        var now    = elapse.start();
        var body   = req ? req.body : null;
        var phrase = typeof(body) === 'object' ? body.phrase : null;
        if (!phrase) {
            return res.jsonp(412, {"code":412, "message": meta.module + '|lex|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null')});
        }
        body.words = api.lex(phrase);
        body.elapsedMs = elapse.stop(now).elapsed;
        res.jsonp(body);
    }

    /**
     * HTTP Request to tag a phrase
     * 
     * @param req: an HTTP request
     * @param res: an HTTP response
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"words":["bye","there"]}' http://tagger.beeker.c9.io/ws/tag/words
     */
    function tagWords(req, res) {
        var now    = elapse.start();
        var body   = req ? req.body : null;
        var words  = typeof(body) === 'object' ? body.words : null;
        if (!words) {
            return res.jsonp(412, {"code":412, "message": meta.module + '|tagWords|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'words is null')});
        }
        body.tags = api.tag(words);
        body.elapsedMs = elapse.stop(now).elapsed;
        res.jsonp(body);
    }

    /**
     * HTTP Request to tag a phrase
     * 
     * @param req: an HTTP request
     * @param res: an HTTP response
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://tagger.beeker.c9.io/ws/tag/phrase
     */
    function tagPhrase(req, res) {
        var now    = elapse.start();
        var body   = req ? req.body : null;
        var phrase = typeof(body) === 'object' ? body.phrase : null;
        if (!phrase) {
            return res.jsonp(412, {"code":412, "message": meta.module + '|tagPhrase|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null')});
        }
        body.words = api.lex(phrase);
        body.tags  = api.tag(body.words);
        body.elapsedMs = elapse.stop(now).elapsed;
        res.jsonp(body);
    }
    
    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "lexPhrase" : lexPhrase,
        "tagPhrase" : tagPhrase,
        "tagWords"  : tagWords
    };
}();
