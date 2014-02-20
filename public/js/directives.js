'use strict';
/* General Chart Wrapper */
angular.module('mean').directive('cjChart', function () {
	return {
		restrict: 'A',
		link: function (scope, elem) {
			var ctx = elem[0].getContext('2d');

			var chart = new Chart(ctx).Bar(scope.chart[scope.$index]);

		}
	};
});
