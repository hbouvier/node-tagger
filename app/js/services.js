angular.module('Services', ['ngResource']).
    factory('Tagger', function($resource) {
        var url = '/ws/v1/pos.json/tag/phrase';
        console.log('url='+url);
        return $resource(url, {}, {});
    })

;
