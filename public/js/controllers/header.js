'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Hard Courses',
        'link': 'hardCourses'
    }, {
        'title': 'Easy Courses',
        'link': 'easyCourses'
    }];
    
    $scope.isCollapsed = false;
}]);