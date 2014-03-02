'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/hardCourses/', {
            templateUrl: 'views/courses/hard.html'
        }).
        when('/easyCourses/', {
            templateUrl: 'views/courses/easy.html'
        }).
        when('/hardCourses/:courseCd', {
            templateUrl: 'views/courses/hardCourses.html'
        }).
        when('/courseSelector', {
            templateUrl: 'views/courses/schedule.html'
        }).
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);
