var TaggerCtrl = [ '$scope', '$http', 'Tagger', function ($scope, $http, Tagger) {
    $scope.tags = {"tags":[]};

    $scope.map = {};
    $scope.map.CC = 'Coord Conjuncn (and,but,or)';
    $scope.map.CD = 'Cardinal number (one,two)';
    $scope.map.DT = 'Determiner (the,some)';
    $scope.map.EX = 'Existential there (there)';
    $scope.map.FW = 'Foreign Word (mon dieu)';
    $scope.map.IN = 'Preposition (of,in,by)';
    $scope.map.JJ = 'Adjective (big)';
    $scope.map.JJR = 'Adj., comparative (bigger)';
    $scope.map.JJS = 'Adj., superlative (biggest)';
    $scope.map.LS = 'List item marker (1,One)';
    $scope.map.MD = 'Modal (can,should)';
    $scope.map.NN = 'Noun, sing. or mass (dog)';
    $scope.map.NNP = 'Proper noun, sing  (Edinburgh)';
    $scope.map.NNPS = 'Proper noun, plural (Smiths)';
    $scope.map.NNS = 'Noun, plural (dogs)';
    $scope.map.POS = 'Possessive ending (Õs)';
    $scope.map.PDT = 'Predeterminer (all, both)';
    $scope.map['PP$'] ='Possessive pronoun (my,oneÕs)';
    $scope.map.PRP = 'Personal pronoun (I,you,she)';
    $scope.map.RB = 'Adverb (quickly)';
    $scope.map.RBR = 'Adverb, comparative (faster)';
    $scope.map.RBS = 'Adverb, superlative (fastest)';
    $scope.map.RP = 'Particle (up,off)';
    $scope.map.SYM = 'Symbol (+,%,&)';
    $scope.map.TO = 'ÒtoÓ (to)';
    $scope.map.UH = 'Interjection (oh, oops)';
    $scope.map.URL = 'url (http://www.google.com/)';
    $scope.map.VB = 'verb, base form (eat)';
    $scope.map.VBD = 'verb, past tense (ate)';
    $scope.map.VBG = 'verb, gerund (eating)';
    $scope.map.VBN = 'verb, past part (eaten)';
    $scope.map.VBP = 'Verb, present (eat)';
    $scope.map.VBZ = 'Verb, present (eats)';
    $scope.map.WDT = 'Wh-determiner (which,that)';
    $scope.map.WP = 'Wh pronoun (who,what)';
    $scope.map['WP$'] = 'Possessive-Wh (whose)';
    $scope.map.WRB = 'Wh-adverb (how,where)';
    $scope.map[','] = 'Comma (,)';
    $scope.map['.'] = 'Sent-final punct (. ! ?)';
    $scope.map[':'] = 'Mid-sent punct (: ; Ñ)';
    $scope.map['$'] = 'Dollar sign ($)';
    $scope.map['#'] = 'Pound sign (#)';
    $scope.map['"'] = 'quote (")';
    $scope.map['('] = 'Left paren [(]';
    $scope.map[')'] = 'Right paren [)]';
    
    
    
    console.log('tags:'+$scope.tags);
    $scope.lexAndTag = function(phrase) {
        console.log('lex and tag:' + phrase);
        //Tagger.save({"phrase":phrase});
        $http.post('/ws/tag/phrase', {"phrase":phrase}).success(function (data) {
            $scope.tags = data;
            console.log('tags/data:', $scope.tags);
        });
    }
}];
