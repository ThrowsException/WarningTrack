'use strict';

var MongoClient = require('mongodb').MongoClient;


function average(coursework, course, callback) {
	coursework.aggregate([
		{$match: {'COURSE_CD' : course}},
		{$group: { _id: '$COURSE_CD', avg_earned_credits: {$avg: '$EARNED_CREDITS'}}}
	], callback);
}


/**
* Returns classes that are more easily taken with the desired course or more difficult
* course: course being taken
* average: average of the course to be taken
**/
function aggregateHard(coursework, course, average, callback) {

	coursework.aggregate([
		{$group : {
			_id : { student: '$MASKED_STUDENT_ID', period: '$ACADEMIC_PERIOD' },
			courses: {$addToSet: { course: '$COURSE_CD', credits: '$EARNED_CREDITS' }}
		}},
		{$match: {'courses.course' : course}},
		{$unwind: '$courses'},
		
		{$match : { $or : [
			{$and: [
				{'courses.course' : course},
				{'courses.credits': {$lt: average}}
			]}, {'courses.course' : {$ne: course}}
		]}},
		{$group: {_id: '$_id', courses: {$push: '$courses'}}},
		{$match: {'courses.course' : course}},
		{$unwind: '$courses'},
		{$match : {'courses.course' : {$ne: course}}},
		{$group: {_id: '$courses.course', average: {$avg: '$courses.credits'}, timesTaken: {$sum: 1}}},
		{$match: { timesTaken: {$gt: 1}}},
		{$sort : {timesTaken : -1}}
	], callback);
}

/**
* Returns classes that are more easily taken with the desired course or more difficult
* course: course being taken
* average: average of the course to be taken
**/
function aggregateEasy(coursework, course, average, callback) {

	coursework.aggregate([
		{$group : {
			_id : { student: '$MASKED_STUDENT_ID', period: '$ACADEMIC_PERIOD' },
			courses: {$addToSet: { course: '$COURSE_CD', credits: '$EARNED_CREDITS' }}
		}},
		{$match: {'courses.course' : course}},
		{$unwind: '$courses'},
		
		{$match : { $or : [
			{$and: [
				{'courses.course' : course},
				{'courses.credits': {$gte: average}}
			]}, {'courses.course' : {$ne: course}}
		]}},
		{$group: {_id: '$_id', courses: {$push: '$courses'}}},
		{$match: {'courses.course' : course}},
		{$unwind: '$courses'},
		{$match : {'courses.course' : {$ne: course}}},
		{$group: {_id: '$courses.course', timesTaken: {$sum: 1}}},
		{$match: { timesTaken: {$gt: 1}}},
		{$sort : {timesTaken : -1}}
	], callback);
}

exports.all = function(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/winter_challenge', function(err, db) {
		db.collection('c_student_coursework').find({}).limit(10).toArray(function(err, docs){
			res.jsonp(docs);
		});
	});
};

exports.course = function(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/winter_challenge', function(err, db) {
		db.collection('c_student_coursework').find({'COURSE_CD' : req.params.course}).toArray(function(err, docs){
			res.jsonp(docs);
		});
	});
};

exports.hardCourses = function(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/winter_challenge', function(err, db) {
		var coursework = db.collection('c_student_coursework');
		var course_cd = req.params.course;
			
		average(coursework, course_cd, function(err, docs) {
			var course = docs[0];
			aggregateHard(coursework, course_cd, course.avg_earned_credits, function(err, docs) {
				console.log(err);
				res.jsonp({results: docs});
			});
		});
	});
};

exports.easyCourses = function(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/winter_challenge', function(err, db) {
		var coursework = db.collection('c_student_coursework');
		var course_cd = req.params.course;
			
		average(coursework, course_cd, function(err, docs) {
			var course = docs[0];
			aggregateEasy(coursework, course_cd, course.avg_earned_credits, function(err, docs) {
				console.log(err);
				res.jsonp({results : docs});
			});
		});
	});
};
