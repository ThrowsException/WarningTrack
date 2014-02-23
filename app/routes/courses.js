'use strict';

// Articles routes use articles controller
var courses = require('../controllers/courses');
var authorization = require('./middlewares/authorization');

module.exports = function(app) {

	app.get('/courses', authorization.requiresLogin, courses.all);

	app.get('/courses/:course',authorization.requiresLogin, courses.course);

	app.get('/hardcourses/:course',authorization.requiresLogin, courses.hardCourses);
	
	app.get('/easycourses/:course', authorization.requiresLogin, courses.easyCourses);
};
