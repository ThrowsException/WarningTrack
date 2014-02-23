'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Courses', ['$resource', function($resource) {
    return $resource('courses/:courseCd', {
        courseCd: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);