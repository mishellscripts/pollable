'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./users.js');

var Poll = new Schema({
    title: {type: String, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    choiceStrings: [{type: String, required: true}],
    choiceVotes: [{type: Number, required: true}],
    display: String,
	stats: {
        numVotes: {type: Number, default: 0},
        createdAt: {type: Number, default: Date.now()}, //unix timestamp
	},
	voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Poll', Poll);
