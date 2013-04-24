module.exports = function () {
    var util   = require('util'),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer(),
        Level   = { "none":0, "error":1, "warning":2, "info":3, "fine":4, "finest":5 },
        level   = Level.none,
        name    = "api";

    function setLevel(newLevel) {
        level = typeof(newLevel) === "number" ? newLevel : Level[newLevel];
    }
        
    function lex(phrase) {
        var words = lexer.lex(phrase);
        return words;
    }
    
    /**
     * Tag a phrase
     * 
     * words: (string): run the lexer first, then the tagger. (array): run the tagger directly
     */ 
    function tag(words) {
        var taggedWords = (typeof(words) === 'string') ? tagger.tag(lexer.lex(words)) : tagger.tag(words);
        return taggedWords;
    }
    
    return {
        "setLevel"   : setLevel,
        "lex"        : lex,
        "tag"        : tag
    };
}();




