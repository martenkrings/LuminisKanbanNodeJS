/**
 * Created by Marten on 10/22/2016.
 */
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    storyId: {type: String, required: true},
    userId: {type: String, required: true},
    content: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Comment', commentSchema);