/**
 * Created by Marten on 10/22/2016.
 */
var mongoose = require('mongoose');

var storySchema = new mongoose.Schema({
    columnId: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    storyPoints: {type: Number, required: true},
    priority: {type: Number, required: true},
    dateCreated: {type: Date, default: Date.now()},
    dateEdited: {type: Date, default: Date.now()},
    userIdCreated: {type: String, required: true},
    userIdLastMoved: {type: String, required: true}
});

module.exports = mongoose.model('Story', storySchema);