module.exports = function () {
    var winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer(),
        meta    = { 
            "module" : "tagger",
            "pid"    : process.pid
        };
        
    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);

    /**
     * Split a phrase into words
     * 
     * @param phrase: A string
     * 
     * @return an array of words
     */
    function lex(phrase) {
        var words = phrase && typeof(phrase) === 'string' ? lexer.lex(phrase) : {status:"Invalid phrase parameter"};
        logger.log('verbose', '%s|lex|phrase=%s|words=%j', meta.module, phrase, words, meta);
        return words;
    }
    
    /**
     * Tag each words in an array of words
     * 
     * @param words: (string): run the lexer first, then the tagger. (array): run the tagger directly
     * 
     * @return an array of array of words with their tags
     */ 
    function tag(words) {
        var taggedWords = (words && typeof(words) === 'string') ? tagger.tag(lexer.lex(words)) : (words && typeof(words) === 'object') ? tagger.tag(words) : {status:"Invalid words parameter"};
        logger.log('verbose', '%s|tag|words=%j|tags=%j', meta.module, words, taggedWords, meta);
        return taggedWords;
    }
    
    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "lex"        : lex,
        "tag"        : tag
    };
}();
