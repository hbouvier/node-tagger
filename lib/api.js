module.exports = function () {
    var util   = require('util'),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer();
        
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
        "lex"        : lex,
        "tag"        : tag
    };
}();




