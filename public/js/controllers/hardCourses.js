'use strict';

angular.module('mean.articles').controller('HardCoursesController', ['$scope', '$routeParams', '$location', 'Global', 'HardCourses', function ($scope, $routeParams, $location, Global, HardCourses) {
    $scope.global = Global;

    $scope.get = function() {
        HardCourses.get({
            courseCd: $routeParams.courseCd
        }, function(course) {
            $scope.course = course;
        });
    };
}]);
