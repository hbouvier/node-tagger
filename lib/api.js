module.exports = function () {
    var util   = require('util'),
        pos    = require('pos'),
        tagger = new pos.Tagger(),
        lexer  = new pos.Lexer();
        
    function lex(phrase) {
        var words = lexer.lex(phrase);
        return words;
    }
    
    function tag(words) {
        var taggedWords = tagger.tag(words);
        return taggedWords;
    }
    
    return {
        "lex"        : lex,
        "tag"        : tag
    };
}();




