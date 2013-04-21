module.exports = function () {
    var util   = require('util'),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer(),
        opt    = {"debug" : false},
        cfg    = {"name"  : "tag"};
        
    function init(options, config) {
        opt = options;
        cfg = config;
    }
        
    function tag(phrase) {
        if (opt.debug) util.log(cfg.name + '|tag|pharse=' + phrase);
        var words = lexer.lex(phrase);
        if (opt.debug) util.log(cfg.name + '|tag|words=' + util.inspect(words));
        var taggedWords = tagger.tag(words);
        if (opt.debug) util.log(cfg.name + '|tag|pharse=' + phrase + '|res=' +util.inspect(taggedWords));
        return taggedWords;
    }
    /**
     * HTTP Request to tag a phrase
     * 
     *   curl http://node-tagger.beeker.c9.io/ws/tag/hello%20bob,%20how%20are%20you
     *   curl http://node-tagger.beeker.c9.io/ws/tag?phrase=yo%20world
     *   curl -X PUT -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://node-tagger.beeker.c9.io/ws/tag
     *   curl -X POST -H "Content-Type: application/json" -d '{"phrase":"bye there"}' http://node-tagger.beeker.c9.io/ws/tag
     */
    function tagRequest(req, res) {
        var body   = (typeof body === "string") ? JSON.parse(req.body) : req.body;
        var phrase = body.phrase ? body.phrase : req.params.phrase ? req.params.phrase : req.query.phrase;
        res.jsonp({ 'words' : tag(phrase) });
    }
    
    return {
        "init"       : init,
        "tag"        : tag,
        "tagRequest" : tagRequest
    };
}();




