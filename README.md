# Part Of Speech (POS) Tagger Web Service

This module is a command line wrapper around the npm module "pos". With it you
can use the POS tagger from the command line or start it as a REST Web Service.

The "pos" module  is maintained by Fortnight Labs.

#LICENSE:

node-tagger is licensed under the GNU LGPLv3


# Installation

npm install -g node-tagger

# Usage on the command line

tagger --phrase='Hello world'

# Usage as a Web Service

## Start the service
tagger --port=3000 &

1. To use only the lexer
> curl -X POST -H "Content-Type: application/json" -d '{"phrase":"Hello worldd"}' http://localhost:3000/ws/lex/phrase

2. To use the tagger on the result from the lexer
> curl -X POST -H "Content-Type: application/json" -d '{"words":["hello","world"]}' http://localhost:3000/ws/tag/words

3. To combine the lexer and the tagger in one request
> curl -X POST -H "Content-Type: application/json" -d '{"phrase":"hello world"}' http://localhost:3000/ws/tag/phrase

### You can also use the HTML User Interface

> http://localhost:3000/

# Include this as a module in your own project

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
    
    // USE: curl -X POST -H "Content-Type: application/json" -d '{"phrase":"hello world"}' http://localhost:3000/tag
    var baseTagURL = '/tag';
    app.post('/tag', tagger.rest.tagPhrase);
    
    app.listen(process.env.PORT || 3000);
    util.log('Listening|port=' + (process.env.PORT || 3000));        

# To run the tests

    cd test
    npm install
    node test.js &
    ./test.sh

# To deploy on Heroku

Make sure you have an account and the "heroku" command line tools installed.
This project already has a Procfile for heroku, the only left is to
replace __MyPersonalTaggerService__ by the name you will chose for your service.

    heroku create --stack cedar __MyPersonalTaggerService__
    git push heroku master

Then open your browser at http://__MyPersonalTaggerService__.herokuapp.com/


