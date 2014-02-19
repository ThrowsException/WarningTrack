'use strict';

var MongoClient = require('mongodb').MongoClient;


function average(coursework, course, callback) {
	coursework.aggregate([
		{$match: {'COURSE_CD' : course}},
		{$group: { _id: '$COURSE_CD', avg_earned_credits: {$avg: '$EARNED_CREDITS'}, timesTaken: {$sum: 1}}}
	], callback);
}


/**
* Returns classes that are more difficult when taken with the desired course 
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
		{$group: {_id: '$courses.course', average: {$avg: '$courses.credits'}, courses: {$push: '$courses'}}},
		{$unwind: '$courses'},
		{$group: {_id: {course: '$_id', average: '$average', earnedCredits: '$courses.credits'}, timesTaken: {$sum: 1}}},
		{$group: {_id: {course: '$_id.course', average: '$_id.average'}, timesTaken: {$sum: '$timesTaken'}, results: {$addToSet: {times: '$timesTaken', credits: '$_id.earnedCredits'}}}},
		{$project: {course: '$_id.course', average: '$_id.average', timesTaken: '$timesTaken', results: '$results', _id: 0}},
		{$match: { timesTaken: {$gt: 1}}},
		{$sort : {timesTaken : -1}}
	], callback);
}

/**
* Returns classes that are more easily taken with the desired course
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
		{$group: {_id: '$courses.course', average: {$avg: '$courses.credits'}, courses: {$push: '$courses'}}},
		{$unwind: '$courses'},
		{$group: {_id: {course: '$_id', average: '$average', earnedCredits: '$courses.credits'}, timesTaken: {$sum: 1}}},
		{$group: {_id: {course: '$_id.course', average: '$_id.average'}, timesTaken: {$sum: '$timesTaken'}, results: {$addToSet: {times: '$timesTaken', credits: '$_id.earnedCredits'}}}},
		{$project: {course: '$_id.course', average: '$_id.average', timesTaken: '$timesTaken', results: '$results', _id: 0}},
		{$match: { timesTaken: {$gt: 1}}},
		{$sort : {timesTaken : -1}}
	], callback);
}

exports.all = function(req, res) {
	MongoClient.connect('mongodb://127.0.0.1:27017/winter_challenge', function(err, db) {
		db.collection('c_student_coursework').find({}).toArray(function(err, docs){
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
			if(course === null || course === undefined) {
				res.jsonp({});
			}
			else {
				aggregateHard(coursework, course_cd, course.avg_earned_credits, function(err, docs) {
					if (err) console.log(err);
					res.jsonp({course: course, results: docs});
				});
			}
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
				if (err) console.log(err);
				res.jsonp({course: course, results : docs});
			});
		});
	});
};
