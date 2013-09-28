module.exports = function () {
    var router  = require('./util/router'),
        pos     = require('./postagger'),
        format  = '.{format}',
        winston = require('winston'),
        logger  = new (winston.Logger)({ transports: [
            new (winston.transports.Console)({
                "level"    : "info",
                "json"     : false,
                "colorize" : true
            })
        ]}),
        meta    = { 
            "module" : "reoutes",
            "pid"    : process.pid,
        };

    logger.log('debug', '%s|loading|module="%s"', meta.module, meta.module, meta);

    /**
     * initialize the routes that the Express Application will serve
     * 
     * @param app: an Express Application object
     * @param context: All the URL will start with that context prefix (e.g.
     *                 "/api/..." or "/webservice/...")
     */
    function init(app, context, swagger) {
        logger.log('debug', '%s|adding|routes|context=%s', meta.module, context, meta);
        if (swagger) {
            describeModels(swagger);
            swagger.addPost({
                'spec': {
                    "path" : context + format + '/lex/phrase', 
                    "notes" : "To use only the lexer to tokenize a phrase. The output of the lexer can be pass directly to the tokenizer.",
                    "method": "POST",
                    "summary" : "Split a phrase into tokens.",
                    "nickname" : "lexer",
                    "responseClass" : "Tokens",
                    "params" : [
                        swagger.params.post("phrase", "A phrase to be tokenized", '{"phrase":"Hello world"}'),
                    ],
                    "errorResponses" : [
                        swagger.errors.notFound('phrase'),
                        swagger.errors.invalid('phrase')
                    ]
                },
                'action': function(req, res) {
                    if (!req.body)
                        throw swagger.error(400, 'Missing body of the request');
                    if (!req.body.phrase)
                        throw swagger.error(400, 'Missing the "phrase" in the body of the request');
                    pos.rest.lexPhrase(req, res);
                }
            }).addPost({
                'spec': {
                    "path" : context + format + '/tag/words',
                    "notes" : "To use the tagger on a list of tokens.",
                    "method": "POST",
                    "summary" : "Tag each tokenized word.",
                    "nickname" : "word-tagger",
                    "responseClass" : "Tags",
                    "params" : [
                        swagger.params.post("words", "A list of tokenized words to be tagged", '{"words":["hello","world"]}'),
                    ],
                    "errorResponses" : [
                        swagger.errors.notFound('words'),
                        swagger.errors.invalid('words')
                    ]
                },
                'action': function(req, res) {
                    if (!req.body)
                        throw swagger.error(400, 'Missing body of the request');
                    if (!req.body.words)
                        throw swagger.error(400, 'Missing the "words" array in the body of the request');
                    pos.rest.tagWords(req, res);
                }
            }).addPost({
                'spec': {
                    "path" : context + format + '/tag/phrase',
                    "notes" : "Use the lexer on the phrase and, tag the resulting tokens.",
                    "method": "POST",
                    "summary" : "Tokenize a phrase and then tag each token.",
                    "nickname" : "tagger",
                    "responseClass" : "Tags",
                    "params" : [
                        swagger.params.post("phrase", "A phrase to be tokenized and tagged", '{"phrase":"Hello world"}'),
                    ],
                    "errorResponses" : [
                        swagger.errors.notFound('phrase'),
                        swagger.errors.invalid('phrase')
                    ]
                },
                'action': function(req, res) {
                    if (!req.body)
                        throw swagger.error(400, 'Missing body of the request');
                    if (!req.body.phrase)
                        throw swagger.error(400, 'Missing the "phrase" in the body of the request');
                    pos.rest.tagPhrase(req, res);
                }
            });
        } else {
            router.add(app, context + '/pos.json/lex/phrase', 'POST', pos.rest.lexPhrase);
            router.add(app, context + '/pos.json/tag/words',  'POST', pos.rest.tagWords);
            router.add(app, context + '/pos.json/tag/phrase', 'POST', pos.rest.tagPhrase);
        }
    }
    
    function describeModels(swagger) {
        swagger.addModels({
            models:{
                "Tokens" : {
                    "id" : "Tokens",
                    "properties" : {
                        "phrase" : { "type" : "string", "required" : true },
                        "words"  : {
                            "word" : { "type" : "string", "required" : true },
                            "type":"Array"
                        }
                    }
                },
                "Tags" : {
                    "id" : "Tags",
                    "properties" : {
                        "phrase" : { "type" : "string", "required" : false },
                        "words"  : {
                            "word" : { "type" : "string", "required" : true },
                            "type":"Array"
                        },
                        "Tags":{
                            "items":{
                                "$ref":"Tuple"
                            },
                            "type":"Array"
                        }
                    }
                },
                "Tuple" : {
                    "id" : "Tuple",
                    "properties" : {
                        "word" : { "type" : "string", "required" : true },
                        "tag" : {
                            "allowableValues":{
                                "values":[
                                    'CC',
                                    'CD',
                                    'DT',
                                    'EX',
                                    'FW',
                                    'IN',
                                    'JJ',
                                    'JJR',
                                    'JJS',
                                    'LS',
                                    'MD',
                                    'NN',
                                    'NNP',
                                    'NNPS',
                                    'NNS',
                                    'POS',
                                    'PDT',
                                    'PP$',
                                    'PRP',
                                    'RB',
                                    'RBR',
                                    'RBS',
                                    'RP',
                                    'SYM',
                                    'TO',
                                    'UH',
                                    'URL',
                                    'VB',
                                    'VBD',
                                    'VBG',
                                    'VBN',
                                    'VBP',
                                    'VBZ',
                                    'WDT',
                                    'WP',
                                    'WP$',
                                    'WRB',
                                    ',',
                                    '.',
                                    ':',
                                    '$',
                                    '#',
                                    '"',
                                    '(',
                                    ')'
                                ],
                                "valueType":"LIST"
                            },
                            "description":"A word tag",
                            "type":"string"
                        }
                    }
                }
            }
        });
    }

    logger.log('debug', '%s|loaded|module="%s"', meta.module, meta.module, meta);
    return {
        "init"     : init,
    };
}();




