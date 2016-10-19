/**
 * Created by Marten on 10/11/2016.
 */
var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now()},
    columns : [{
        name: {type: String, required: true},
        position: {type: Number, required: true, unique: true},
        wipLimit: {type: Number, required: false},
        stories: [{
            title: {type: String, required: true},
            description: {type: String, required: true},
            storyPoints: {type: Number, required: true},
            priority: {type: Number, required: true},
            dateCreated: {type: Date, default: Date.now()},
            dateMoved: {type: Date, default: Date.now()},
            userIdCreated: {type: String, required: true},
            userIdLastMoved: {type: String, required: true},
            comments: [{
                userId: {type: String, required: true},
                content: {type: String, required: true},
                dateCreated: {type: Date, default: Date.now()}
            }]
        }]
    }],
    roles: [{
        name: {type: String, required: true},
        manageStories: {type: Boolean, default: false},
        moveFrom: [{
            columnId: {type: Number, required: true}
        }]
    }]
});

module.exports = mongoose.model('Board', boardSchema);