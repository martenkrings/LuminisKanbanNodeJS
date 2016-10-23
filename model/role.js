/**
 * Created by Marten on 10/19/2016.
 */
var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
    boardId: {type: String, required: true},
    name: {type: String, required: true},
    manageStories: {type: Boolean, default: false},
    moveFrom: [{
        columnId: {type: Number, required: true}
    }]
});

module.exports = mongoose.model('Role', roleSchema);