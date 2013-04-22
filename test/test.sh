#!/bin/sh
echo Testing Lexer
curl http://tagger.beeker.c9.io/ws/lex/hello%20world
curl http://tagger.beeker.c9.io/ws/lex?phrase=hello%20world
curl -X POST -H "Content-type: application/json" -d '{"phrase":"hello world"}' http://tagger.beeker.c9.io/ws/lex

echo Testing Tagger
curl http://tagger.beeker.c9.io/ws/tag/hello%20world
curl http://tagger.beeker.c9.io/ws/tag?phrase=hello%20world
curl -X POST -H "Content-type: application/json" -d '{"phrase":"hello world"}' http://tagger.beeker.c9.io/ws/tag
curl -X POST -H "Content-type: application/json" -d '{"words":["hello","world"]}' http://tagger.beeker.c9.io/ws/tag

curl -X PUT -H "Content-type: application/json" -d '{"phrase":"hello world"}' http://tagger.beeker.c9.io/ws/tag
curl -X PUT -H "Content-type: application/json" -d '{"words":["hello","world"]}' http://tagger.beeker.c9.io/ws/tag