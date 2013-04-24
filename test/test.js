var util    = require('util'),
    tagger  = require('node-tagger'),
    express = require('express'),
    app     = express();
    
// Lex the phrase, then Tag it.
util.log('Hello World = ' +  util.inspect(tagger.api.tag(tagger.api.lex('Hello World'))));

////////////////////////////////////////////////////////////////////////
//
// Express configuration for ALL environment
//
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.errorHandler());
});

var baseTagURL = '/tag'; 
app.post('/tag', tagger.rest.tagPhrase);

app.listen(process.env.PORT || 3000);
util.log('Listening|port=' + (process.env.PORT || 3000));        
