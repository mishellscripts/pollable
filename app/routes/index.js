'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var Poll = require('../models/polls.js');
var User = require('../models/users.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

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
    			choiceVotes: numVotes
        	})
        	poll.save(function(err) {
            	if (err) throw err;
            });
            
            // Find user and update user info
            User.findOneAndUpdate({'github.id': req.user.github.id}, 
            			{ $push: { polls: poll }, $inc: {pollsCreated: 1} }, 
            			function(err) { 
            				if (err) throw err; 
            				res.redirect('/poll/' + poll._id);
            			});
		});
		
	app.route('/poll/:pollid')
		.get(isLoggedIn, function(req, res) {
			Poll.findOne({'_id': req.params.pollid}, function(err, target) {
				res.render('pollview', {poll: target});
			})
		});

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			Poll.find({}, function (err, allPolls) {
        		if (err) res.render('index', {polls: err.message});

    		}).sort({'stats.createdAt': -1}).then(function(allPolls) {
    			res.render('index', {polls: allPolls});
    		});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render('profile');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
