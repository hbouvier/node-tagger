module.exports = function () {
    var util   = require('util'),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer(),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = process.env.NODE_DEBUG || Level.none,
        name    = "api";
        
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
     * Split a phrase into words
     * 
     * @param phrase: A string
     * 
     * @return an array of words
     */
    function lex(phrase) {
        var words = phrase && typeof(phrase) === 'string' ? lexer.lex(phrase) : {status:"Invalid phrase parameter"};
        if (level >= Level.finest) util.log(name + '|lex|result=' + util.inspect(words));
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
        if (level >= Level.finest) util.log(name + '|tag|result=' + util.inspect(taggedWords));
        return taggedWords;
    }
    
    if (level >= Level.finest) util.log(name + '|loaded|module="' + name + '"');
    return {
        "setLevel"   : setLevel,
        "lex"        : lex,
        "tag"        : tag
    };
}();
