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
>> curl -X POST -H "Content-Type: application/json" -d '{"phrase":"Hello worldd"}' http://localhost:3000/ws/lex/phrase

2. To use the tagger on the result from the lexer
>> curl -X POST -H "Content-Type: application/json" -d '{"words":["hello","world"]}' http://localhost:3000/ws/tag/words

3. To combine the lexer and the tagger in one request
>> curl -X POST -H "Content-Type: application/json" -d '{"phrase":"hello world"}' http://localhost:3000/ws/tag/phrase


# Include this as a module in your own project
