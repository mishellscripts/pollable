'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users.js');

var Poll = new Schema({
    title: {type: String, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    choiceStrings: [String],
    choiceVotes: [{ type: Number, default: 0 }],
	stats: {
        numVotes: {type: Number, default: 0},
        createdAt: {type: Number, default: Date.now()}, //unix timestamp
	},
	voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Poll', Poll);
