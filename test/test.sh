#!/bin/sh
echo Testing Lexer
HOST=localhost:3000
if [ "$1" != "" ] ; then
	HOST=$1
fi
curl -X POST -H "Content-type: application/json" -d '{"phrase":"hello world"}' http://${HOST}/lex

echo Testing Tagger
curl -X POST -H "Content-type: application/json" -d '{"phrase":"hello world"}' http://${HOST}/tag/phrase
curl -X POST -H "Content-type: application/json" -d '{"words":["hello","world"]}' http://${HOST}/tag/words

