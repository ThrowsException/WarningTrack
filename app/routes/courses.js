'use strict';

// Articles routes use articles controller
var courses = require('../controllers/courses');
//var authorization = require('./middlewares/authorization');

module.exports = function(app) {

	app.get('/courses', courses.all);
	app.get('/courses/:course', courses.course);
	app.get('/hardcourses/:course', courses.hardCourses);
	app.get('/easycourses/:course', courses.easyCourses);
};
