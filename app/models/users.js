'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	},
   pollsCreated: Number,
   pollsVoted: Number
});

module.exports = mongoose.model('User', User);
