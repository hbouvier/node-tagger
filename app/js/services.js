angular.module('Services', ['ngResource']).
    factory('Tagger', function($resource) {
        var url = '/ws/tag/phrase';
        console.log('url='+url);
        return $resource(url, {}, {});
    })

;
