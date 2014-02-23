'use strict';

angular.module('mean.articles').controller('CoursesController', ['$scope', '$routeParams', '$location', '$http', 'Global', 'Courses', function ($scope, $routeParams, $location, $http, Global, Courses) {
	$scope.global = Global;
	$scope.courses = [];
	$scope.chart = [];

	$scope.find = function() {
		console.log($scope.courseCd);
		Courses.get({courseCd: $scope.courseCd}, function(course) {
			$scope.courses.push(course);
			
			for(var i=0; i < course.courses.length; i++) {
				var data = {};
				data.datasets = [];
				data.labels = [];
				
				data.datasets.push({
					fillColor : 'rgba(220,220,220,0.5)',
					strokeColor : 'rgba(220,220,220,1)',
					data : []
				});
				for(var j=0; j < course.courses.length; j++) {
					var result = course.courses[j];
					data.labels.push(result.credits);
					data.datasets[0].data.push(result.timesTaken);
				}
			}

			$scope.chart.push(data);
		
		});
	};

	$scope.httpGet = function() {
		$http({method: 'GET', url: '/distinctcourses'}).
		    success(function(data, status, headers, config) {
		      	$scope.courses = data;
		    }).
		    error(function(data, status, headers, config) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	};
}]);
