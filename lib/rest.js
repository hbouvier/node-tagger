module.exports = function () {
    var util   = require('util'),
        api    = require('./api'),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = "rest";

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
        
    /**
     * HTTP Request to lex a phrase
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://tagger.beeker.c9.io/ws/lex/phrase
     */
    function lexPhrase(req, res) {
        var body   = req ? req.body : null;
        var phrase = typeof(body) === 'object' ? body.phrase : null;
        if (!phrase) {
            throw new Error(name + '|lex|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null'));
        }
        body.words = api.lex(phrase);
        res.jsonp(body);
    }

    /**
     * HTTP Request to tag a phrase
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"words":["bye","there"]}' http://tagger.beeker.c9.io/ws/tag/words
     */
    function tagWords(req, res) {
        var body   = req ? req.body : null;
        var words  = typeof(body) === 'object' ? body.words : null;
        if (!words) {
            throw new Error(name + '|tagWords|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'words is null'));
        }
        body.tags = api.tag(words);
        res.jsonp(body);
    }

    /**
     * HTTP Request to tag a phrase
     * 
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://tagger.beeker.c9.io/ws/tag/phrase
     */
    function tagPhrase(req, res) {
        var body   = req ? req.body : null;
        var phrase = typeof(body) === 'object' ? body.phrase : null;
        if (!phrase) {
            throw new Error(name + '|tagPhrase|EXCEPTION|invalid request body: ' + (body === null ? 'body is null' : 'phrase is null'));
        }
        body.words = api.lex(phrase);
        body.tags  = api.tag(body.words);
        res.jsonp(body);
    }
    
    return {
        "setLevel"  : setLevel,
        "lexPhrase" : lexPhrase,
        "tagPhrase" : tagPhrase,
        "tagWords"  : tagWords
    };
}();
