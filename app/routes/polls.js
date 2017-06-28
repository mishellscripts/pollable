var Poll = require('../models/polls.js');
var User = require('../models/users.js');
var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports.getPoll = function(req, res) {
	Poll.findById(req.params.pollid, function(err, poll) {
		if (err) { 				
			err.status = 404;
   			return res.render('error', {errStatus: err.status,
   					message: "Oh, no! Poll not found :<" });
		}
		// If firstVote (true), user cannot see the results
		var firstVote = req.isAuthenticated() ? poll.voters.indexOf(req.user.id) : true;
		var removable = req.isAuthenticated() ? 
		poll.creator.toString() === req.user.id.toString() : false;
		res.render('pollview', {poll: poll, firstVote: firstVote, removable: removable,
			loggedIn: req.isAuthenticated()
		});
	});	
}

module.exports.createPoll = function(req, res) {
    // Trim body choices (when user doesnt fill all the choices)
    var trimIndex = req.body.choice.indexOf('');
    var choices = trimIndex >= 0 ? req.body.choice.slice(0, trimIndex) : req.body.choice;
	
    // Depending on # choices n, create array size n initialized to zeros
	var numVotes = Array.apply(null, Array(choices.length))
			        		.map(Number.prototype.valueOf, 0);
	
	// Create poll from schema w/ input data
	var poll = new Poll({
		title: req.body.title,
    	creator: req.user,
    	choiceStrings: choices,
    	choiceVotes: numVotes,
    	display: req.body['data-display'] || 'bar' //default value
	});
    // Save new poll to the database
    poll.save(function(err) {
        if (err) {
            err.status = 400;
            return res.render('error', {errStatus: err.status, 
            	message: "Please enter a title and at least 2 choices for your poll"
            });
        }
        // Find user and update user info
	    User.findByIdAndUpdate(req.user.id, { $push: { polls: poll }, $inc: {pollsCreated: 1} }, 
            function(err) { 
           		if (err) {
           			console.log(err.message);
           		    return res.render('error', {errStatus: err.status,
           				message: "Oh, no! Error encountered" });	
           		}
         		return res.redirect('/poll/' + poll._id);
         	});
    });
}

module.exports.deletePoll = function(req, res) {
	Poll.findById(req.params.pollid, function(err, poll) {
		if (err) { 				
			err.status = 404;
	   		return res.render('error', {errStatus: err.status,
	   				message: "Oh, no! Poll not found :<" });
		}
		poll.remove();
		// Remove poll from user
		User.findByIdAndUpdate(req.user.id, 
		{ $pull: { polls: new ObjectId(poll.id) }, $inc: {pollsCreated: -1} }, 
	        function(err) { 
	       		if (err) {
	       		    return res.render('error', {errStatus: err.status,
	       				message: "Oh, no! Error encountered" });	
	       		}
	    	});
	});
}

module.exports.vote = function(req, res) {
    // Only valid if user has not voted
    // Pass result from previous function to next for synchronization
    async.waterfall([
        // First, find the poll to update vote count
	    function(callback){
		    Poll.findById(req.params.pollid, function(err, target) {
				if (err) {
					return res.render('error', {errStatus: err.status,
           							message: "Oh, no! Error encountered"});
				} 
				// Check for poll cheaters
				if (target.voters.indexOf(req.user.id) >= 0) {
				    return res.render('error', {errStatus: 409,
           							message: "You've already voted on this poll!"});
				}
    			var choiceIndex = target.choiceStrings.indexOf(req.body.choice);
    			// Check if choice vote is valid
    			if (choiceIndex >= 0) {
	    			// Clone the votes array for the poll
	    			var votes = target.choiceVotes;
	    			// Update the vote count for user vote
	    			votes[choiceIndex]+=1;
	    			// Send data to the next function
	    		    callback(null, votes);
    			} else {
    				res.render('error', {errStatus: 409, message: "Please vote before submitting the form!"});
    			}
		    })
	    },
		function(votes, callback){
            var userInc = { 'pollsVoted': 1 }; // Since $inc needs dynamic object
            var pollInc = { 'stats.numVotes': 1 };		    	
			// Update total user votes
			User.findByIdAndUpdate(req.user.id, {$inc: userInc}, function(err, user) {
				if (err) {
					return res.render('error', {errStatus: err.status,
	           					message: "Oh, no! Error encountered"});
				} 
		    	// Update poll votes array, total votes, and add user to list of voters
			    Poll.findByIdAndUpdate(req.params.pollid, 
				    {$set: {choiceVotes: votes}, $push: {voters: user}, $inc: pollInc}, 
					function(err, poll) {
						if (err) {
						    return res.render('error', {errStatus: err.status,
	           							message: "Oh, no! Error encountered"});
						} 
						var removable = req.isAuthenticated() ? 
						poll.creator.toString() === req.user._id.toString() : false;
						return res.render('pollview', {poll: poll, firstVote: false, 
								loggedIn: req.isAuthenticated(), removable: removable})
					}
				);
			});
		},
	], function (err,result) {
	    if (err) {
			return res.render('error', {errStatus: err.status,
           				message: "Oh, no! Error encountered"});
		} 
		console.log(result);
	});
}