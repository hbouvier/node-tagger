# Part Of Speech (POS) Tagger Web Service

This module is a command line wrapper around the npm module "pos". With it you
can use the POS tagger from the command line or start it as a REST Web Service.

The "pos" module  is maintained by Fortnight Labs.

#LICENSE:

node-tagger is licensed under the GNU LGPLv3


# Installation

npm install -g node-tagger

# Usage on the command line

tagger Hello world

# Usage as a Web Service

## Start the service
tagger --port=3000 &

1. To use only the lexer
> curl -X POST -H "Content-Type: application/json" -H "x-api-key: henri-id" -d '{"phrase":"Hello worldd"}' http://localhost:3000/ws/v1/pos.json/lex/phrase

2. To use the tagger on the result from the lexer
> curl -X POST -H "Content-Type: application/json" -H "x-api-key: henri-id" -d '{"words":["hello","world"]}' http://localhost:3000/ws/v1/pos.json/tag/words

3. To combine the lexer and the tagger in one request
> curl -X POST -H "Content-Type: application/json" -H "x-api-key: henri-id" -d '{"phrase":"hello world"}' http://localhost:3000/ws/v1/pos.json/tag/phrase

### You can also use the HTML User Interface

> http://localhost:3000/

### You can also use the HTML API Documentation User Interface

> http://localhost:3000/docs/

# Include this as a module in your own project

    var tagger  = require('node-tagger'),
        express = require('express'),
        app     = express();
    
    // Lex the phrase, then Tag it.
    console.log('Hello World = ', tagger.api.tag(tagger.api.lex('Hello World')));
    
    ////////////////////////////////////////////////////////////////////////
    //
    // Express configuration for ALL environment
    //
    app.configure(function () {
        app.use(express.bodyParser());
        app.use(express.errorHandler());
    });
    
    // USE: curl -X POST -H "Content-Type: application/json" -d '{"phrase":"hello world"}' http://localhost:3000/tag/phrase
    app.post('/lex', tagger.rest.lexPhrase);
    app.post('/tag/phrase', tagger.rest.tagPhrase);
    app.post('/tag/words', tagger.rest.tagWords);
    
    app.listen(process.env.PORT || 3000);
    console.log('Listening|port=' + (process.env.PORT || 3000));

# To run the tests

    npm test
    
# To run the server

    npm start

# To deploy on Heroku

Make sure you have an account and the "heroku" command line tools installed.
This project already has a Procfile for heroku, the only left is to
replace __MyPersonalTaggerService__ by the name you will chose for your service.

    heroku create --stack cedar __MyPersonalTaggerService__
    heroku config:set BASEURL=__MyPersonalTaggerService__.herokuapp.com
    git push heroku master

Then open your browser at http://__MyPersonalTaggerService__.herokuapp.com/
or http://__MyPersonalTaggerService__.herokuapp.com/docs/ to have the REST API doc


