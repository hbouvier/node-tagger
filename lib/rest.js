module.exports = function () {
    var util   = require('util'),
        api    = require('./api');
        
    function lex(req, res) {
        var body   = (typeof body === "string") ? JSON.parse(req.body) : req.body;
        var phrase = body.phrase ? body.phrase : req.params.phrase ? req.params.phrase : req.query.phrase;
        res.jsonp({ 'words' : api.lex(phrase) });
    }

    /**
     * HTTP Request to tag a phrase
     * 
     *   curl http://node-tagger.beeker.c9.io/ws/tag/hello%20bob,%20how%20are%20you
     *   curl http://node-tagger.beeker.c9.io/ws/tag?phrase=yo%20world
     *   curl -X PUT -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://node-tagger.beeker.c9.io/ws/tag
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://node-tagger.beeker.c9.io/ws/tag
     */
    function tag(req, res) {
        var body   = (typeof body === "string") ? JSON.parse(req.body) : req.body;
        var words  = body.words ? body.words : req.params.words ? req.params.words : req.query.words;
        if (!words) {
            var phrase = body.phrase ? body.phrase : req.params.phrase ? req.params.phrase : req.query.phrase;
            words = api.lex(phrase);
        }
        res.jsonp({ 
            "words"  : words,
            "tagged" : api.tag(words)
        });
    }

    return {
        "lex" : lex,
        "tag" : tag,
    };
}();
