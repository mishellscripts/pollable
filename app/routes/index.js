'use strict';

var Poll = require('../models/polls.js');
var User = require('../models/users.js');
var polls = require('./polls.js');


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
			polls.createPoll(req,res);
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
		.post(isLoggedIn, function(req, res) {
			polls.vote(req, res);
		});

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			Poll.find({}, function (err, allPolls) {
        		if (err) return res.render('index', {polls: err.message});
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
