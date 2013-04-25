angular.module('Application', ['Services']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/tagger', {controller:TaggerCtrl, templateUrl:'partials/tagger.html'}).
            otherwise({redirectTo:'/tagger'});
    }])
    .
    directive('ngIf', function() {
        return {
            link: function(scope, element, attrs) {
                if(scope.$eval(attrs.ngIf)) {
                    // remove '<div ng-if...></div>'
                    element.replaceWith(element.children())
                } else {
                    element.replaceWith(' ')
                }
            }
        }
    })

;
