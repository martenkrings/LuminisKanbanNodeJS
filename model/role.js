/**
 * Created by Marten on 10/19/2016.
 */
var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    boardId: {type: String, required: true},
    roleIndex: {type: Number, required: true}
});

module.exports = mongoose.model('Role', roleSchema);