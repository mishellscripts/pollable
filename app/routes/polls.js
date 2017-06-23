var Poll = require('../models/polls.js');
var User = require('../models/users.js');
var async = require('async');

module.exports.createPoll = function(req, res) {
    // Depending on # choices n, create array size n initialized to zeros
	var numVotes = Array.apply(null, Array(req.body.choice.length))
			        		.map(Number.prototype.valueOf,0);
	// Create poll from schema w/ input data
	var poll = new Poll({
		title: req.body.title,
    	creator: req.user,
    	choiceStrings: req.body.choice,
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
	    User.findOneAndUpdate({'github.id': req.user.github.id}, 
        { $push: { polls: poll }, $inc: {pollsCreated: 1} }, 
            function(err) { 
           		if (err) {
           		    return res.render('error', {errStatus: err.status,
           				message: "Oh, no! Error encountered" });	
           		}
         		return res.redirect('/poll/' + poll._id);
         	});
    });
}

module.exports.vote = function(req, res) {
    // Only valid if user has not voted
    // Pass result from previous function to next for synchronization
    async.waterfall([
        // First, find the poll to update vote count
	    function(callback){
		    Poll.findOne({'_id': req.params.pollid}, function(err, target) {
				if (err) {
					return res.render('error', {errStatus: err.status,
           							message: "Oh, no! Error encountered"});
				} 
				// Check for poll cheaters
				if (target.voters.indexOf(req.user._id) >= 0) {
				    return res.render('error', {errStatus: 409,
           							message: "You've already voted on this poll!"});
				}
    			var choiceIndex = target.choiceStrings.indexOf(req.body.choice);
    			// Clone the votes array for the poll
    			var votes = target.choiceVotes;
    			// Update the vote count for user vote
    			votes[choiceIndex]+=1;
    			// Send data to the next function
    		    callback(null, votes);
		    })
	    },
		function(votes, callback){
            var userInc = { 'pollsVoted': 1 }; // Since $inc needs dynamic object
            var pollInc = { 'stats.numVotes': 1 };		    	
			// Update total user votes
			User.findOneAndUpdate({'_id': req.user._id},{ $inc: userInc })
		    // Update poll votes array, total votes, and add user to list of voters
		    Poll.findOneAndUpdate({'_id': req.params.pollid}, 
			    {$set: {choiceVotes: votes}, $push: {voters: req.user}, $inc: pollInc}, 
				function(err, target) {
					if (err) {
					    return res.render('error', {errStatus: err.status,
           						message: "Oh, no! Error encountered"});
					} 
					return res.render('pollview', {script: '/public/js/polls.js', 
						poll: target})
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