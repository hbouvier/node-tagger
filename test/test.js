var util    = require('util'),
    tagger  = require('node-tagger'),
    express = require('express'),
    app     = express();
    
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
app.get(baseTagURL + '/:phrase?', tagger.rest.tag); // ".../tag/hello world" and ".../tag?phase=hello world"
app.put(baseTagURL, tagger.rest.tag);               // ".../tag" with body '{ phrase : "hello world" }'
app.post(baseTagURL, tagger.rest.tag);              // ".../tag" with body '{ phrase : "hello world" }'    

app.listen(process.env.PORT || 3000);
util.log('Listening|port=' + (process.env.PORT || 3000));        
