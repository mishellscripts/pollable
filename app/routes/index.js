'use strict';

var path = process.cwd();
var Poll = require('../models/polls.js');
var User = require('../models/users.js');
var async = require('async');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/poll/new')
		.get(isLoggedIn, function (req, res) {
			res.render('newpoll');
		})
		.post(isLoggedIn, function (req, res) {
			// Depending on # choices n, create array size n initialized to zeros
			var numVotes = Array.apply(null, Array(req.body.choice.length))
							.map(Number.prototype.valueOf,0);
			var poll = new Poll({
				title: req.body.title,
    			creator: req.user,
    			choiceStrings: req.body.choice,
    			choiceVotes: numVotes,
    			display: req.body['data-display'] || 'bar' //default value
        	});
        	
        	poll.save(function(err) {
            	if (err) {
            		err.status = 400;
            		return res.render('error', {errStatus: err.status, 
            			message: "Please enter a title and at least 2 choices for your poll"
            		});
            	}
            	else {
            		// Find user and update user info
	        		User.findOneAndUpdate({'github.id': req.user.github.id}, 
            		{ $push: { polls: poll }, $inc: {pollsCreated: 1} }, 
            			function(err) { 
           					if (err) {
           						return res.render('error', {errStatus: err.status,
           							message: "Oh, no! Error encountered"
           						});	
           					}
         					return res.redirect('/poll/' + poll._id);
         				}
         			);
           		}
        	});
		});
	
	app.route('/poll/:pollid')
		.get(function(req, res) {
			Poll.findOne({'_id': req.params.pollid}, function(err, target) {
				if (err) { 				
					err.status = 404;
           			return res.render('error', {errStatus: err.status,
           					message: "Oh, no! Poll not found :<" });
				}
				res.render('pollview', {poll: target});
			});
		})
		// post - Cast a vote
		.post(isLoggedIn, function(req, res) {
			async.waterfall([
		    function(callback){
		        Poll.findOne({'_id': req.params.pollid}, function(err, target) {
				if (err) {
					return res.render('error', {errStatus: err.status,
           							message: "Oh, no! Error encountered"});
				} 
				// Find index of choice and store it
				var choiceIndex = target.choiceStrings.indexOf(req.body.choice);
				var votes = target.choiceVotes;
				votes[choiceIndex]+=1;
		        callback(null, votes);
		    })},
		    function(votes, callback){
				User.findOneAndUpdate({'github.id': req.user.github.id}, 
            		{ $inc: {pollsVoted: 1} });
		        Poll.findOneAndUpdate({'_id': req.params.pollid}, 
				{$set: {choiceVotes: votes}, $push: {voters: req.user}, $inc: {'stats.numVotes': 1}}, 
				function(err, target) {
					if (err) {
					return res.render('error', {errStatus: err.status,
           						message: "Oh, no! Error encountered"});
					} 
					else res.send(target);
				});
		    },
		], function (err,result) {
		    if (err) {
				return res.render('error', {errStatus: err.status,
           					message: "Oh, no! Error encountered"});
			} 
		    console.log(result);
		});
		});

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			Poll.find({}, function (err, allPolls) {
        		if (err) res.render('index', {polls: err.message});
    		}).sort({'stats.createdAt': -1}).then(function(allPolls) {
    			res.render('index', {user: req.user, polls: allPolls});
    		});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login');
		});
		
	/*app.route('/signup')
		.get(function(req, res) {
			res.render('signup');
		});
		.post(function (req, res) {
			 User.register(new User({ username : req.body.username }), req.body.password, 
				function(err, account) {
			 		if (err) { return res.render('register', { account : account }); }
			 		passport.authenticate('local')(req, res, function () {
		            res.redirect('/');
		        });
			});
		});*/

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			var pollIDs = req.user.polls;
			var polls = [];
			pollIDs.forEach(function(pollID) {
				Poll.findOne({'_id': pollID}, function(err, pollByID) {
            		if (err) throw err;
            		polls.push(pollByID);
            		if (pollIDs.length === polls.length) {
            			res.render('profile', {polls: polls, user: req.user});
            		}
            	})
			});
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
};
