/**
 * Created by Marten on 10/11/2016.
 */
var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now()},
    roles: [{
        name: {type: String, required: true},
        manageStories: {type: Boolean, default: false},
        moveFrom: [{
            columnId: {type: Number, required: true}
        }]
    }]
});

module.exports = mongoose.model('Board', boardSchema);