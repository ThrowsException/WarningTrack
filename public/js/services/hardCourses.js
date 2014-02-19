'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('HardCourses', ['$resource', function($resource) {
    return $resource('hardCourses/:courseCd', {
        articleId: '@_id'
    }, {});
}]);
