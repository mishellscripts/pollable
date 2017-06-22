'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Poll = require('./polls.js');

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	},
	username: String,
	polls: [{type: mongoose.Schema.Types.ObjectId, ref:'Poll'}],
	pollsVoted: {type: Number, default: 0},
	pollsCreated: {type: Number, default: 0}
});

module.exports = mongoose.model('User', User);
