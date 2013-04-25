module.exports = function () {
    var util   = require('util'),
        api    = require('./api'),
        elapse = require('./elapse'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "rest";

    if (level >= Level.finest) util.log(name + '|loading|module="' + name + '"');
    /**
     * set the logging level
     * 
     * @param: newLevel The verbosity of the logging.
     */
    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
        
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
            return res.jsonp(412, {"code":412, "message": name + '|lex|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null')});
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
            return res.jsonp(412, {"code":412, "message": name + '|tagWords|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'words is null')});
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
            return res.jsonp(412, {"code":412, "message": name + '|tagPhrase|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null')});
        }
        body.words = api.lex(phrase);
        body.tags  = api.tag(body.words);
        body.elapsedMs = elapse.stop(now).elapsed;
        res.jsonp(body);
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"  : setLevel,
        "lexPhrase" : lexPhrase,
        "tagPhrase" : tagPhrase,
        "tagWords"  : tagWords
    };
}();
