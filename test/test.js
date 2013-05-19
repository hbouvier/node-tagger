var util    = require('util'),
    tagger  = require('../lib/postagger'),
    express = require('express'),
    app     = express(),
    port    = process.env.PORT || 3000;
    
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

app.post('/lex', tagger.rest.lexPhrase);
app.post('/tag/phrase', tagger.rest.tagPhrase);
app.post('/tag/words', tagger.rest.tagWords);

app.listen(port);
util.log('Listening|port=' + port);



var http = require('http');
var options = {
  host: 'localhost',
  path: '/tag/phrase',
  port: port,
  method: 'POST',
  headers: {'Content-Type': 'application/json'}
};

var timer = setTimeout(function () {
    util.log('ERROR:REST /tag/phrase/ timed out');
    process.exit(-1);
}, 10000);

var callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
     clearTimeout(timer);
     var obj = JSON.parse(str);
     if (obj && obj.tags && obj.tags.length === 2 && obj.tags[0][1] === 'UH' && obj.tags[1][1]==='NNP') {
        util.log('SUCCESS: REST /tag/phrase');
        console.log(obj);
        process.exit(0);
     } else {
        util.log('FAILED: REST /tag/phrase');
        console.log(str);
        process.exit(-1);
         
     }
  });
};

console.log('request:', options);
var req = http.request(options, callback);
req.write(JSON.stringify({"phrase":"Hello World"}));
req.end();


