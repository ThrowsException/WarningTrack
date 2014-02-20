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

	$scope.find = function() {
		HardCourses.get({
			courseCd: $scope.courseCd
		}, function(course) {
			$scope.course = course;
			var chart = [];
			for(var i=0; i < course.results.length; i++) {
				var data = {};
				data.datasets = [];
				data.labels = [];
				var results = course.results[i].results;
				data.datasets.push({
					fillColor : 'rgba(220,220,220,0.5)',
					strokeColor : 'rgba(220,220,220,1)',
					data : []
				});
				for(var j=0; j < results.length; j++) {
					var result = results[j];
					data.labels.push(result.credits);
					data.datasets[0].data.push(result.times);
				}
				chart.push(data);
			}

			$scope.chart = chart;
		});
	};
}]);
